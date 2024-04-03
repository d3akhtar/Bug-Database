// a function that returns true if a userid belongs to an admin, and false otherwise
// this was the function used in the server

function isAdmin(userId) {
    return new Promise((resolve, reject) => {
        const sql = `SELECT * FROM users WHERE id=${userId} AND isAdmin = TRUE`;
        con.query(sql, [userId], (err, results) => {
            if (err) {
                console.error('Error executing query:', err);
                reject(err);
                return;
            }
            resolve(results.length > 0);
        });
    });
}