var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "owner",
  password: "0000",
  database: "bugs"
});

console.log("yeet");

document.getElementById('myButton').addEventListener('click', con.connect(function(err) {
	if (err) throw err;
	console.log("Connected!");
	var makeBug = "INSERT INTO bugs() VALUES()";
	var addComment = "INSERT INTO comments(bug_id, author_id, title, body) SELECT MAX(id), 2, "title", "comment/description" FROM bugs";

	con.query(makeBug, function (err, result) {
    		if (err) throw err;
    		console.log("bug created");
  	});
	con.query(addComment, function (err, result) {
		if (err) throw err;
		console.log("comment added");
 	});
})
);

// makes a new bug with the title and description as the first comment
//function addBug(title, description){
//	var db=openDatabase("brs", "1.0", "brs contribution/user database", 65535);
//	var query = 
//	var bugID = // SELECT MAX(id);
//	"INSERT INTO comments(bug_id, author_id, title, body) SELECT MAX(id), 2, "title", "comment/description" FROM bugs"
//	})
//	commentBug(bugID, title, description);
//} // 0 if ok