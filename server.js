const http = require("http");
const bodyParser = require("body-parser");
const express = require("express");
const mysql = require("mysql");
const path = require("path");
const fs = require("fs");
const session = require("express-session");
const os = require("os");
const nodemailer = require("nodemailer");

const app = express();
const hostname = "0.0.0.0";
const port = 3000;

// Configure session middleware
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 60 * 60 * 1000 * 24,
    },
  }),
);

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    secret: "your_secret_key",
    resave: false,
    saveUninitialized: true,
  }),
);

// fetch username and password from json
let readData;

try {
  const data = fs.readFileSync("./userSQL.json", "utf8");
  readData = JSON.parse(data);
} catch (error) {
  console.error("Error reading or parsing userSQL.json:", error);
}

const userData = readData;

// some con query thing that sends the emails to a fetched list of users

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
  con.query("SHOW DATABASES LIKE 'bugsForBugBytes'", (err, results) => {
    if (err) {
      console.error("Error checking if database exists:", err);
      throw err;
    }

    if (results.length === 0) {
      // Database doesn't exist, create it
      con.query("CREATE DATABASE bugsForBugBytes", (err) => {
        if (err) {
          console.error("Error creating database:", err);
          throw err;
        }
        console.log("Database 'bugsForBugBytes' created");

        // Connect to the 'bugs' database
        con.changeUser({ database: "bugsForBugBytes" }, (err) => {
          if (err) {
            console.error("Error connecting to 'bugs' database:", err);
            throw err;
          }
          console.log("Connected to 'bugsForBugBytes' database");

          // Call a function to create tables and fill data if needed
          createTablesAndFillData();
        });
      });
    } else {
      // Database exists, connect to it directly
      con.changeUser({ database: "bugsForBugBytes" }, (err) => {
        if (err) {
          console.error("Error connecting to 'bugs' database:", err);
          throw err;
        }
        console.log("Connected to 'bugsForBugBytes' database");
      });
    }
  });
});

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
      email VARCHAR(255) UNIQUE,
      password TEXT,
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
    )`,
  ];

  // Query to insert user
  const insertUserQuery = [
    `INSERT INTO users(username, email, password, isAdmin) VALUES("admin1", "user@gmail.com", "1234", TRUE)`,
    `INSERT INTO users(id, username, email, password, isAdmin) VALUES(0, "Deleted User", null, null, false)`,
    `UPDATE users SET id=0 WHERE username="null"`,
  ];

  // Execute create table queries
  createQueries.forEach((query) => {
    con.query(query, (err, results) => {
      if (err) {
        console.error("Error creating table:", err);
        throw err;
      }
      console.log("Table created:", results);
    });
  });

  // Execute insert user query
  insertUserQuery.forEach((query) => {
    con.query(query, (err, results) => {
      if (err) {
        console.error("Error inserting user:", err);
        throw err;
      }
      console.log("query executed:", results);
    });
  });
}

const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "your_email@gmail.com", // Your email address
    pass: "your_password", // Your email password
  },
});

function sendEmailToUsers(users, subject, message) {
  // Iterate over each user
  users.forEach((user) => {
    // Create email message
    const mailOptions = {
      from: "bugByte406@gmail.com", // Sender's email address
      to: user.email, // Receiver's email address
      subject: subject,
      text: message,
    };

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email:", error);
      } else {
        console.log("Email sent:", info.response);
      }
    });
  });
}

function getEmailsForBug(bugId, subject, message) {
  const query = `
    SELECT DISTINCT u.email
    FROM users u
    JOIN comments c ON u.id = c.author_id
    WHERE c.bug_id = ?;
  `;

  con.query(query, [bugId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }

    const emails = results.map((result) => result.email);
    console.log(emails);
    // sendEmailToUsers(emails, subject, message);
    return;
  });
}

function convertToUTCMinus4(timestampStr) {
  // Parse the timestamp string into a Date object
  const date = new Date(timestampStr);

  // Get the timezone offset in minutes
  const offsetInMinutes = date.getTimezoneOffset();

  // Convert the timezone offset to milliseconds
  const offsetInMilliseconds = offsetInMinutes * 60 * 1000;

  // Adjust the date to UTC-4 by subtracting the offset
  const dateUTCMinus4 = new Date(date.getTime() - offsetInMilliseconds);

  return dateUTCMinus4;
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
  console.log(dateDiffInDays(startDate, endDate) + 1);
  let result = new Array(dateDiffInDays(startDate, endDate) + 1).fill(0);

  // Iterate over each bug
  //console.log(bugs);
  bugs.forEach((bug) => {
    // Calculate the difference in days between the bug's dateAdded and the start date
    const daysSinceStart = dateDiffInDays(
      new Date(startDate),
      new Date(convertToUTCMinus4(bug.dateAdded)),
    );

    // Increment the number of bugs added on the corresponding day
    result[daysSinceStart]++;
    bugsAdded++;

    // If the bug has been resolved, adjust counts accordingly
    if (bug.dateResolved) {
      const daysResolved = dateDiffInDays(
        new Date(startDate),
        new Date(bug.dateResolved),
      );
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
    result,
  };
}

function incrementDate(dateString) {
  // Convert the date string to a JavaScript Date object
  const date = new Date(dateString);

  // Increment the date by one day
  date.setDate(date.getDate() + 1);

  // Format the incremented date as YYYY-MM-DD
  const incrementedDateString = date.toISOString().split("T")[0];

  return incrementedDateString;
}

function getBugReports(startDate, endDate, callback) {
  // Construct the SQL query to fetch bug reports within the specified date range
  const sql = `SELECT * FROM bugs WHERE dateAdded >= ? AND dateAdded < ?`;
  const asql = "SELECT SUM(1) AS total FROM bugs WHERE dateAdded <= ?";
  const bsql = "SELECT SUM(1) AS total FROM bugs WHERE dateResolved <= ?";

  // Execute the query to get the total bugs added until the start date
  con.query(asql, [startDate], (err, aResult) => {
    if (err) {
      console.error("Error executing query:", err);
      callback(err, null);
      return;
    }

    // Execute the query to get the total bugs resolved until the start date
    con.query(bsql, [startDate], (err, bResult) => {
      if (err) {
        console.error("Error executing query:", err);
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
          console.error("Error executing query:", err);
          callback(err, null);
          return;
        }

        // Modify bug reports based on a, b, and n
        console.log(results.length);
        const modifiedResults = calculateBugStats(
          results,
          startDate,
          endDate,
          n,
        );
        console.log(modifiedResults);
        // Pass the modified bug reports to the callback function
        callback(null, modifiedResults, n);
      });
    });
  });
}

app.get("/getBugStatus/:bugId", (req, res) => {
  const bugId = req.params.bugId;

  // Query the database to fetch the bug with the specified ID
  const sql = `SELECT id, dateResolved FROM bugs WHERE id = ?`;
  con.query(sql, [bugId], (error, results) => {
    if (error) {
      console.error("Error fetching bug details:", error);
      res.status(500).json({ error: "Failed to fetch bug details" });
    } else {
      if (results.length === 0) {
        // Bug with the specified ID not found
        res.status(404).json({ error: "Bug not found" });
      } else {
        // Bug found, return whether dateResolved is null or not
        const bug = results[0];
        const isResolved = bug.dateResolved !== null;
        res.json({ bugId: bug.id, isResolved: isResolved });
      }
    }
  });
});

// Add a route to handle the AJAX request for retrieving bug reports
app.post("/sprintDetails", (req, res) => {
  const { startDate, endDate } = req.body;
  // add something so that if endDate > todayDate, endDate = todayDate
  // might need more work since endDate is const

  // Call the getBugReports function with the provided start and end dates
  getBugReports(startDate, endDate, (err, bugReports) => {
    if (err) {
      console.error("Error retrieving bug reports:", err);
      res.status(500).send("Error retrieving bug reports");
      return;
    }
    // Send the retrieved bug reports back to the client
    res.json(bugReports);
  });
});

app.get("/getBugsTable", (req, res) => {
  // Query to fetch comments from the database
  const order = req.query.param;
  const sql = `SELECT 
    b.id AS bug_id,
    c.title AS comment_title,
    c.body AS comment_body,
    LEFT(DATE(b.dateAdded), 10) AS bug_dateAdded,
    CASE
        WHEN b.dateResolved IS NULL THEN LEFT(DATE(b.dateModified), 10)
        ELSE "Complete"
    END AS bug_dateModified
FROM 
    bugs b
JOIN 
    comments c ON b.id = c.bug_id AND b.dateAdded = c.dateAdded`;

  // Execute the query
  con.query(sql + " " + order, (error, results) => {
    if (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    } else {
      // Send the comments as a JSON response
      res.json(results);
    }
  });
});

app.get("/getCommentsForBug", (req, res) => {
  // Query to fetch comments from the database
  const id = req.query.param;
  const sql = `SELECT
    u.username AS author_username,
    c.title AS comment_title,
    c.body AS comment_body,
    LEFT(DATE(c.dateAdded), 10) AS comment_dateAdded
FROM
    comments c
JOIN
    users u ON c.author_id = u.id
JOIN
    bugs b ON c.bug_id = b.id
WHERE
    c.bug_id = ${id}
ORDER BY
    b.dateAdded ASC`;

  // Execute the query
  con.query(sql, (error, results) => {
    if (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ error: "Failed to fetch comments" });
    } else {
      // Send the comments as a JSON response
      res.json(results);
    }
  });
});

function isAdmin(userId) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE id=${userId} AND isAdmin = TRUE`;
    con.query(sql, [userId], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
        return;
      }
      resolve(results.length > 0);
    });
  });
}

function isTakenUsername(username) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE username="${username}"`;
    con.query(sql, [username], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
        return;
      }
      resolve(results.length > 0);
    });
  });
}

function isTakenEmail(email) {
  return new Promise((resolve, reject) => {
    const sql = `SELECT * FROM users WHERE email="${email}"`;
    con.query(sql, [email], (err, results) => {
      if (err) {
        console.error("Error executing query:", err);
        reject(err);
        return;
      }
      resolve(results.length > 0);
    });
  });
}

app.post("/addUser", (req, res) => {
  const { email, username, password, confirmPassword, adminSetting } = req.body;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  console.log("server here");
  if (!isLoggedIn) {
    console.log("not logged in");
    res.sendStatus(401); // Unauthorized - Current password is incorrect
    return;
  }
  isAdmin(userId)
    .then((isAdmin) => {
      if (isAdmin) {
        isTakenUsername(username)
          .then((isTakenUsername) => {
            if (isTakenUsername) {
              console.log("username taken");
              res.sendStatus(409); // username taken
              return;
            }
            isTakenEmail(email)
              .then((isTakenEmail) => {
                if (isTakenEmail) {
                  console.log("email taken");
                  res.sendStatus(410); // username taken
                  return;
                }
                const sql = `INSERT INTO users(username, email, password, isAdmin) VALUES("${username}", "${email}", "${password}", ${adminSetting})`;
                con.query(sql, (err, results) => {
                  if (err) {
                    console.log("query error");
                    console.error("Error executing query:", err);
                    return;
                  }
                  console.log("user added");
                  res.sendStatus(200); // user added
                  return;
                });
              })
              .catch((error) => {
                console.error("Error:", error);
                res.sendStatus(500);
              });
          })
          .catch((error) => {
            console.error("Error:", error);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(404); // admin with given id not found
        return;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.sendStatus(500);
    });
});

// should probably make this not change the user's own password
app.post("/removeUser", (req, res) => {
  const { username } = req.body;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  console.log("server here");
  if (!isLoggedIn) {
    console.log("not logged in");
    res.sendStatus(401); // Unauthorized - Current password is incorrect
    return;
  }
  isAdmin(userId)
    .then((isAdmin) => {
      if (isAdmin) {
        isTakenUsername(username)
          .then((isTakenUsername) => {
            if (!isTakenUsername) {
              console.log("no user exists");
              res.sendStatus(404); // username doesn't exist
              return;
            }

            const check = `SELECT * FROM users WHERE username = "${username}" AND id = "${userId}"`;
            con.query(check, (err, results) => {
              if (err) {
                console.log("query error");
                console.error("Error executing query:", err);
                return;
              }
              if (results.length > 0) {
                console.log("cannot remove yourself");
                res.sendStatus(400); // user not removed
                return;
              }
              const sql = `UPDATE comments c JOIN users u ON c.author_id = u.id SET c.author_id = 0 WHERE u.username = "${username}"`;
              const sql2 = `DELETE FROM users WHERE username = "${username}"`;
              con.query(sql, (err, results) => {
                if (err) {
                  console.log("query error");
                  console.error("Error executing query:", err);
                  return;
                }
                console.log("updated user comments");
                return;
              });
              con.query(sql2, (err, results) => {
                if (err) {
                  console.log("query error");
                  console.error("Error executing query:", err);
                  return;
                }
                console.log("user removed");
                res.sendStatus(200); // user added
                return;
              });
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(401); // admin with given id not found
        return;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.sendStatus(500);
    });
});

app.post("/changeUserPassword", (req, res) => {
  const { username, newPassword, confirmPassword } = req.body;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  console.log("server here");
  if (!isLoggedIn) {
    console.log("not logged in");
    res.sendStatus(401); // Unauthorized - Current password is incorrect
    return;
  }
  isAdmin(userId)
    .then((isAdmin) => {
      if (isAdmin) {
        isTakenUsername(username)
          .then((isTakenUsername) => {
            if (!isTakenUsername) {
              console.log(username);
              console.log("no user exists");
              res.sendStatus(404); // username doesn't exist
              return;
            }
            const sql = `UPDATE users SET password = "${newPassword}" WHERE username = "${username}"`;
            con.query(sql, (err, results) => {
              if (err) {
                console.log("query error");
                console.error("Error executing query:", err);
                return;
              }
              console.log("user's password changed");
              res.sendStatus(200); // user added
              return;
            });
          })
          .catch((error) => {
            console.error("Error:", error);
            res.sendStatus(500);
          });
      } else {
        res.sendStatus(401); // admin with given id not found
        return;
      }
    })
    .catch((error) => {
      console.error("Error:", error);
      res.sendStatus(500);
    });
});

app.post("/checkCurrentPassword", (req, res) => {
  const { currentPassword } = req.body;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  console.log("server here");
  if (!isLoggedIn) {
    console.log("not logged in");
    res.sendStatus(401); // Unauthorized - Current password is incorrect
    return;
  }
  const sql = `SELECT * FROM users WHERE id = ? AND password = ?`;
  con.query(sql, [userId, currentPassword], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      return;
    }
    if (results.length > 0) {
      console.log("user found");
      res.sendStatus(200); // Current password is correct
      return;
    }
    res.sendStatus(404); // Current password is correct
  });
});

app.post("/createPassword", (req, res) => {
  const { newPassword } = req.body;
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;

  console.log("changing password server here");
  if (!isLoggedIn) {
    console.log("not logged in");
    res.sendStatus(401); // Unauthorized - Current password is incorrect
    return;
  }
  console.log("yeet1");
  const sql = `UPDATE users SET password = ? WHERE id = ?`;
  con.query(sql, [newPassword, userId], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.sendStatus(400);
      return;
    }
    res.sendStatus(200);
  });
});

app.use(express.static("public"));

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept",
  );
  next();
});

app.post("/resolveBugAndComment", (req, res) => {
  // Retrieve bugId, title, and description from the request body
  const userId = req.session.userId;
  const isLoggedIn = req.session.isLoggedIn;
  const { bugId, title, description } = req.body;

  // Check if the user is logged in
  if (!isLoggedIn) {
    // probably add a line here that yeets the user back to the login screen
    res.status(401).send("User not logged in");
    return;
  }

  // Execute the queries to resolve the bug and add a comment
  const resolveBugQuery =
    "UPDATE bugs SET dateResolved = CURRENT_TIMESTAMP, dateModified = CURRENT_TIMESTAMP WHERE id = ?";
  const addCommentQuery =
    "INSERT INTO comments(bug_id, author_id, title, body) VALUES (?, ?, ?, ?)";

  con.beginTransaction((err) => {
    if (err) {
      console.error("Error beginning transaction:", err);
      res.status(500).send("Internal Server Error");
      return;
    }

    // Execute the query to resolve the bug
    con.query(resolveBugQuery, [bugId], (err, result) => {
      if (err) {
        console.error("Error resolving bug:", err);
        con.rollback(() => {
          res.status(500).send("Error resolving bug");
        });
        return;
      }

      // Execute the query to add a comment
      con.query(
        addCommentQuery,
        [bugId, userId, title, description],
        (err, result) => {
          if (err) {
            console.error("Error adding comment:", err);
            con.rollback(() => {
              res.status(500).send("Error adding comment");
            });
            return;
          }

          // Commit the transaction
          con.commit((err) => {
            if (err) {
              console.error("Error committing transaction:", err);
              con.rollback(() => {
                res.status(500).send("Error committing transaction");
              });
              return;
            }
            getEmailsForBug(
              bugId,
              `Report#${bugId}: New Activity`,
              "This report has been resolved, please do not reply.",
            );
            console.log("Bug resolved and comment added successfully");
            res.status(200).send("Bug resolved and comment added successfully");
          });
        },
      );
    });
  });
});

app.post("/updateBug", (req, res) => {
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
  const updateBug =
    "UPDATE bugs SET dateModified = CURRENT_TIMESTAMP WHERE id = ?";
  const insertComment =
    "INSERT INTO comments(bug_id, author_id, title, body) VALUES (?, ?, ?, ?)";

  const participants = "SELECT * FROM ";
  con.query(updateBug, [bugId], (updateErr, result) => {
    if (updateErr) {
      console.error("Error updating bug report:", err);
      res.status(500).send("Error updating bug report");
      return;
    }
    con.query(
      insertComment,
      [bugId, userId, title, description],
      (insertErr, insertResult) => {
        if (insertErr) {
          console.error("Error adding comment:", insertErr);
          res.status(500).send("Error adding comment");
          return;
        }
        getEmailsForBug(
          bugId,
          `Report#${bugId}: New Activity`,
          "This report has recieved new activity, please do not reply.",
        );
        res
          .status(200)
          .send("Bug report updated and comment added successfully");
      },
    );
  });
});

// Route handler for adding a bug and comment
app.post("/addBugAndComment", (req, res) => {
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
  const addCommentQuery =
    "INSERT INTO comments(bug_id, author_id, title, body) SELECT MAX(id), ?, ?, ? FROM bugs";

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
      res.redirect("/home.html");
    });
  });
});

// Login endpoint
app.post("/login", (req, res) => {
  /// I need to make this not case sensitive for username
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
      res.redirect("/dashboard");
    } else {
      res.status(401).send("Invalid username or password");
    }
  });
});

app.post("/logout", (req, res) => {
  // Perform logout actions here, such as destroying session, clearing cookies, etc.
  console.log("logging out");
  // For example, if you're using sessions with express-session middleware
  req.session.destroy((err) => {
    if (err) {
      console.error("Error destroying session:", err);
      res.sendStatus(500); // Internal Server Error
      return;
    }
    // Redirect the user to the login page after successful logout
    console.log("The cookie muncher has devoured your cookie");
    res.redirect("/login.html");
  });
});

// back to login
app.get("/checkLogin", (req, res) => {
  if (!req.session.isLoggedIn) {
    res.redirect("/login"); // Redirect to login page if not logged in
  } else {
    res.end();
  }
});

// Dashboard endpoint (protected route)
app.get("/dashboard", (req, res) => {
  if (req.session.isLoggedIn) {
    res.redirect("/home.html");
  } else {
    res.redirect("/login.html"); // Redirect to login page if not logged in
  }
});

// Route handler for serving index.html
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// Get local IP address
const interfaces = os.networkInterfaces();
let ipAddress;
for (const ifaceName in interfaces) {
  const iface = interfaces[ifaceName];
  for (const alias of iface) {
    if (alias.family === "IPv4" && !alias.internal) {
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
