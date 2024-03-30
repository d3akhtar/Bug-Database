const http = require('http');
const express = require('express');
const mysql = require('mysql');
const path = require('path');
const session = require('express-session');
const os = require('os');

const app = express();
const hostname = '0.0.0.0';
const port = 3000;

// Configure session middleware
app.use(session({
  secret: 'your_secret_key',
  resave: false,
  saveUninitialized: true
}));

// Create a MySQL connection
const con = mysql.createConnection({
  host: "localhost",
  user: "owner",
  password: "0000",
  database: "bugs"
});

// Connect to the database
con.connect((err) => {
  if (err) {
    console.error("Error connecting to database:", err);
    throw err;
  }
  console.log("Connected to database");
});

app.use(express.static('public'));

// Middleware to enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, OPTIONS, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Route handler for adding a bug and comment
app.get('/addBugAndComment', (req, res) => {
  // Retrieve user ID from session
  const userId = req.session.userId;

  if (!userId) {
    res.status(401).send("User not logged in");
    return;
  }
	console.log(userId);

  const makeBugQuery = "INSERT INTO bugs() VALUES()";
  const addCommentQuery = "INSERT INTO comments(bug_id, author_id, title, body) SELECT MAX(id), ?, 'title', 'comment/description' FROM bugs";

  con.query(makeBugQuery, (err, result) => {
    if (err) {
      console.error("Error creating bug:", err);
      res.status(500).send("Error creating bug");
      return;
    }
    
    console.log("Bug created");
    
    con.query(addCommentQuery, [userId], (err, result) => {
      if (err) {
        console.error("Error adding comment:", err);
        res.status(500).send("Error adding comment");
        return;
      }

      console.log("Comment added");
      res.send("Bug and comment added successfully");
    });
  });
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