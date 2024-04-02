const http = require('http');
const bodyParser = require('body-parser');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const fs = require('fs');
const session = require('express-session');
const os = require('os');

const app = express();
const hostname = '0.0.0.0';
const port = 3000;

// Configure session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    maxAge: (60 * 60 * 1000 * 24)
  }
}));

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// fetch username and password from json
let readData;

try {
  const data = fs.readFileSync('./userSQL.json', 'utf8');
  readData = JSON.parse(data);
} catch (error) {
  console.error('Error reading or parsing userSQL.json:', error);
}

const userData = readData;

// Create a MySQL connection
const con = mysql.createConnection({
  host: "localhost",
  user: userData.username,
  password: userData.password,
});

// Connect to MySQL server
con.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL server:", err);
    throw err;
  }
  console.log("Connected to MySQL server");

  // Check if the database exists
  con.query("SHOW DATABASES LIKE 'bugs'", (err, results) => {
    if (err) {
      console.error("Error checking if database exists:", err);
      throw err;
    }

    if (results.length === 0) {
      // Database doesn't exist, create it
      con.query("CREATE DATABASE bugs", (err) => {
        if (err) {
          console.error("Error creating database:", err);
          throw err;
        }
        console.log("Database 'bugs' created");

        // Connect to the 'bugs' database
        con.changeUser({ database: "bugs" }, (err) => {
          if (err) {
            console.error("Error connecting to 'bugs' database:", err);
            throw err;
          }
          console.log("Connected to 'bugs' database");

          // Call a function to create tables and fill data if needed
          createTablesAndFillData();
        });
      });
    } else {
      // Database exists, connect to it directly
      con.changeUser({ database: "bugs" }, (err) => {
        if (err) {
          console.error("Error connecting to 'bugs' database:", err);
          throw err;
        }
        console.log("Connected to 'bugs' database");
      });
    }
  });
});

// Function to create tables and fill data if needed
// Function to create tables and fill data if needed
function createTablesAndFillData() {
  // Queries to create tables
  const createQueries = [
    `CREATE TABLE bugs (
      id INT PRIMARY KEY AUTO_INCREMENT,
      dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
      dateModified DATETIME DEFAULT CURRENT_TIMESTAMP,
      dateResolved DATETIME
    )`,
    `CREATE TABLE users (
      id INT PRIMARY KEY AUTO_INCREMENT,
      username VARCHAR(8) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      password TEXT NOT NULL,
      isAdmin BOOLEAN NOT NULL
    )`,
    `CREATE TABLE comments (
      id INT AUTO_INCREMENT,
      author_id INT NOT NULL,
      bug_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      body TEXT,
      dateAdded DATETIME DEFAULT CURRENT_TIMESTAMP,
      PRIMARY KEY (id),
      FOREIGN KEY (author_id) REFERENCES users(id),
      FOREIGN KEY (bug_id) REFERENCES bugs(id)
    )`
  ];

  // Query to insert user
  const insertUserQuery = `INSERT INTO users(username, email, password, isAdmin) VALUES("admin1", "user@gmail.com", "1234", TRUE)`;

  // Execute create table queries
  createQueries.forEach(query => {
    con.query(query, (err, results) => {
      if (err) {
        console.error("Error creating table:", err);
        throw err;
      }
      console.log("Table created:", results);
    });
  });

  // Execute insert user query
  con.query(insertUserQuery, (err, results) => {
    if (err) {
      console.error("Error inserting user:", err);
      throw err;
    }
    console.log("Default Admin Created:", results);
  });
}

function calculateBugStats(bugs, startDate, endDate, startingNum) {
    // Call the calculateBugStats function here with the bug reports array
    // Define a helper function to calculate the difference in days between two dates
    function dateDiffInDays(date1, date2) {
  	// Convert date strings to Date objects
	const a = new Date(date1);
  	const b = new Date(date2);

  	// Calculate the difference in milliseconds
	const diffInMs = b - a;

  	// Convert milliseconds to days
	return Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    }

    // Initialize variables to track bug counts and results
    let bugsAdded = 0;
    let bugsResolved = 0;
    let netIncrease = 0;
    let result = new Array(dateDiffInDays(startDate, endDate) + 1).fill(0);

    // Iterate over each bug
//console.log(bugs);
    bugs.forEach(bug => {
        // Calculate the difference in days between the bug's dateAdded and the start date
        const daysSinceStart = dateDiffInDays(new Date(startDate), new Date(bug.dateAdded));
        
        // Increment the number of bugs added on the corresponding day
        result[daysSinceStart]++;
        bugsAdded++;

        // If the bug has been resolved, adjust counts accordingly
        if (bug.dateResolved) {
            const daysResolved = dateDiffInDays(new Date(startDate), new Date(bug.dateResolved));
            if (daysResolved < result.length) {
                result[daysResolved]--;
                bugsResolved++;
            }
        }
    });
    let net = startingNum;
    for (let i = 0; i < result.length; i++) {
	//console.log(result.length);
        result[i] += net;
        net = result[i];
    }

    // Calculate net increase in bugs
    netIncrease = result[result.length - 1] - result[0];

    // Return results as an object
    return {
        netIncrease,
        bugsAdded,
        bugsResolved,
        result
    };
}

function incrementDate(dateString) {
  // Convert the date string to a JavaScript Date object
  const date = new Date(dateString);
  
  // Increment the date by one day
  date.setDate(date.getDate() + 1);
  
  // Format the incremented date as YYYY-MM-DD
  const incrementedDateString = date.toISOString().split('T')[0];
  
  return incrementedDateString;
}

function getBugReports(startDate, endDate, callback) {
    // Construct the SQL query to fetch bug reports within the specified date range
    const sql = `SELECT * FROM bugs WHERE dateAdded >= ? AND dateAdded < ?`;
    const asql = 'SELECT SUM(1) AS total FROM bugs WHERE dateAdded <= ?';
    const bsql = 'SELECT SUM(1) AS total FROM bugs WHERE dateResolved <= ?';

    // Execute the query to get the total bugs added until the start date
    con.query(asql, [startDate], (err, aResult) => {
        if (err) {
            console.error('Error executing query:', err);
            callback(err, null);
            return;
        }

        // Execute the query to get the total bugs resolved until the start date
        con.query(bsql, [startDate], (err, bResult) => {
            if (err) {
                console.error('Error executing query:', err);
                callback(err, null);
                return;
            }

            // Calculate a, b, and n
            const a = aResult[0].total || 0;
            const b = bResult[0].total || 0;
            const n = a - b;

            // Execute the query to fetch bug reports within the specified date range
            con.query(sql, [startDate, incrementDate(endDate)], (err, results) => {
                if (err) {
                    console.error('Error executing query:', err);
                    callback(err, null);
                    return;
                }

                // Modify bug reports based on a, b, and n
                console.log(results.length);
		const modifiedResults = calculateBugStats(results, startDate, endDate, n);
		console.log(modifiedResults);
                // Pass the modified bug reports to the callback function
                callback(null, modifiedResults, n);
            });
        });
    });
}

// Add a route to handle the AJAX request for retrieving bug reports
app.post('/sprintDetails', (req, res) => {
    const { startDate, endDate } = req.body;
	// add something so that if endDate > todayDate, endDate = todayDate
	// might need more work since endDate is const

    // Call the getBugReports function with the provided start and end dates
    getBugReports(startDate, endDate, (err, bugReports) => {
        if (err) {
            console.error('Error retrieving bug reports:', err);
            res.status(500).send('Error retrieving bug reports');
            return;
        }
        // Send the retrieved bug reports back to the client
        res.json(bugReports);
    });
});

app.get('/getCommentsForBug', (req, res) => {
  // Query to fetch comments from the database
	const order = req.query.param;
  const sql = `SELECT 
    b.id AS bug_id,
    c.title AS comment_title,
    c.body AS comment_body,
    LEFT(DATE(b.dateAdded), 10) AS bug_dateAdded,
    LEFT(DATE(b.dateModified), 10) AS bug_dateModified,
    CASE
        WHEN b.dateResolved IS NOT NULL THEN LEFT(DATE(b.dateResolved), 10)
        ELSE "In Progress"
    END AS bug_resolved
FROM 
    bugs b
JOIN 
    comments c ON b.id = c.bug_id
AND b.dateResolved IS NULL`;

  // Execute the query
  con.query(sql + " " + order, (error, results) => {
    if (error) {
      console.error('Error fetching comments:', error);
      res.status(500).json({ error: 'Failed to fetch comments' });
    } else {
      // Send the comments as a JSON response
      res.json(results);
    }
  });
});

app.use(express.static('public'));

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/resolveBugAndComment', (req, res) => {
    // Retrieve bugId, title, and description from the request body
    const userId = 1; // req.session.userId;
    const isLoggedIn = req.session.isLoggedIn;
    const { bugId, title, description } = req.body;
    
    // Check if the user is logged in
    if (!isLoggedIn) {
	// probably add a line here that yeets the user back to the login screen
        res.status(401).send("User not logged in");
        return;
    }


    // Execute the queries to resolve the bug and add a comment
    const resolveBugQuery = 'UPDATE bugs SET dateResolved = CURRENT_TIMESTAMP, dateModified = CURRENT_TIMESTAMP WHERE id = ?';
    const addCommentQuery = 'INSERT INTO comments(bug_id, author_id, title, body) VALUES (?, ?, ?, ?)';

    con.beginTransaction((err) => {
        if (err) {
            console.error('Error beginning transaction:', err);
            res.status(500).send('Internal Server Error');
            return;
        }

        // Execute the query to resolve the bug
        con.query(resolveBugQuery, [bugId], (err, result) => {
            if (err) {
                console.error('Error resolving bug:', err);
                con.rollback(() => {
                    res.status(500).send('Error resolving bug');
                });
                return;
            }

            // Execute the query to add a comment
            con.query(addCommentQuery, [bugId, userId, title, description], (err, result) => {
                if (err) {
                    console.error('Error adding comment:', err);
                    con.rollback(() => {
                        res.status(500).send('Error adding comment');
                    });
                    return;
                }

                // Commit the transaction
                con.commit((err) => {
                    if (err) {
                        console.error('Error committing transaction:', err);
                        con.rollback(() => {
                            res.status(500).send('Error committing transaction');
                        });
                        return;
                    }

                    console.log('Bug resolved and comment added successfully');
                    res.status(200).send('Bug resolved and comment added successfully');
                });
            });
        });
    });
});

app.post('/updateBug', (req, res) => {
    const userId = req.session.userId;
    const isLoggedIn = req.session.isLoggedIn;
    const { bugId, title, description } = req.body;
    
    // Check if the user is logged in
    if (!isLoggedIn) {
	// probably add a line here that yeets the user back to the login screen
        res.status(401).send("User not logged in");
        return;
    }

    // Update the bug report in the database
	// I should also make a few lines to check if the bug is resolved or not
    const updateBug = 'UPDATE bugs SET dateModified = CURRENT_TIMESTAMP WHERE id = ?';
    const insertComment = 'INSERT INTO comments(bug_id, author_id, title, body) VALUES (?, ?, ?, ?)';

    con.query(updateBug, [bugId], (updateErr, result) => {
        if (updateErr) {
            console.error('Error updating bug report:', err);
            res.status(500).send('Error updating bug report');
            return;
        }
        con.query(insertComment, [bugId, 1, title, description], (insertErr, insertResult) => {
            if (insertErr) {
                console.error('Error adding comment:', insertErr);
                res.status(500).send('Error adding comment');
                return;
            }

            res.status(200).send('Bug report updated and comment added successfully');
        });
    });
});

// Route handler for adding a bug and comment
app.post('/addBugAndComment', (req, res) => {
  // Retrieve user ID from session
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  if (!isLoggedIn) {
	// probably add a line here that yeets the user back to the login screen
    res.status(401).send("User not logged in");
    return;
  }

  const { title, description } = req.body;

  const makeBugQuery = "INSERT INTO bugs() VALUES()";
  const addCommentQuery = "INSERT INTO comments(bug_id, author_id, title, body) SELECT MAX(id), ?, ?, ? FROM bugs";

  con.query(makeBugQuery, (err, result) => {
    if (err) {
      console.error("Error creating bug:", err);
      res.status(500).send("Error creating bug");
      return;
    }
    
    console.log("Report created");
    
    con.query(addCommentQuery, [userId, title, description], (err, result) => {
      if (err) {
        console.error("Error adding comment:", err);
        res.status(500).send("Error adding comment");
        return;
      }

      console.log("Comment added");
      res.redirect('/home.html');
    });
  });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { username, password, rememberMe } = req.body;

  const sql = `SELECT * FROM users WHERE username = ? AND password = ?`;
  con.query(sql, [username, password], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    if (results.length > 0) {
      // Start a session
      const userId = results[0].id;
      req.session.userId = userId;
      req.session.isLoggedIn = true;
      if (rememberMe) {
	console.log("big cookie");
        req.session.cookie.maxAge = 30 * 24 * 60 * 60 * 1000; // 30 days
      } else {
	console.log("smol cookie");
      }
      res.redirect('/dashboard');
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

// back to login
app.get('/checkLogin', (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect('/login'); // Redirect to login page if not logged in
  } else {
    res.end();
  }
});

// Dashboard endpoint (protected route)
app.get('/dashboard', (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect('/home.html');
  } else {
    res.redirect('/login.html'); // Redirect to login page if not logged in
  }
});

// Route handler for serving index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Get local IP address
const interfaces = os.networkInterfaces();
let ipAddress;
for (const ifaceName in interfaces) {
  const iface = interfaces[ifaceName];
  for (const alias of iface) {
    if (alias.family === 'IPv4' && !alias.internal) {
      ipAddress = alias.address;
      break;
    }
  }
  if (ipAddress) {
    break;
  }
}

// Start the server 
// change first line below to "const server = app.listen(port, ipAddress, () => {"const server = app.listen(port, ipAddress, () => {"
// for hosting a server to current ipaddress
const server = app.listen(port, () => {
  const host = server.address().address;
  const port = server.address().port;
  console.log(`Server running at http://${host}:${port}`);
});