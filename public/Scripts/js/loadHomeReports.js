document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch comments from the server
    function fetchComments() {
        console.log("fetching...");
        const order = 'ORDER BY b.dateModified DESC';
        const url = `/getBugsTable?param=${encodeURIComponent(order)}`;

        return fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch comments');
                }
                return response.json();
            })
            .catch(error => {
                console.error('Error:', error);
            });
    }

    // Function to check bug status asynchronously (written in file, just don't know how to call it)
    async function checkBugStatus(bugId) {
        try {
            const response = await fetch(`/getBugStatus/${bugId}`);
            if (!response.ok) {
                throw new Error('Failed to fetch bug status');
            }
            const data = await response.json();
            return data.isResolved;
        } catch (error) {
            console.error('Error:', error);
            return null;
        }
    }

    // Call fetchComments when the page is loaded
    fetchComments()
        .then(async items => {
            // Get the container div
            const container = document.getElementById('bugTable');

            // Loop through the items array and create a div for each item
            for (const item of items) {
                console.log(item);
                const tr = document.createElement('tr');
                tr.onclick = function () {
                    console.log("clicked");
                    console.log(item.bug_id);
                    localStorage.setItem("bug_id", item.bug_id);
                    window.location.href = "/Pages/viewBug.html";
                }
                for (const key in item) {
                    const td = document.createElement('td');
                    console.log(key);
                    td.innerText = item[key];
                    tr.appendChild(td);
                }
                container.appendChild(tr);
            }
        });
});
