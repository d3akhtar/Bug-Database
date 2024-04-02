document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch comments from the server
    function fetchComments() {
        const order = 'ORDER BY b.dateModified DESC';
        const url = `/getCommentsForBug?param=${encodeURIComponent(order)}`;

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

    // Function to check bug status asynchronously
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
                const tr = document.createElement('tr');
                for (const key in item) {
                    const td = document.createElement('td');
                    td.innerText = item[key];
                    tr.appendChild(td);
                }
                console.log(item["bug_id"]);
                const stat = await checkBugStatus(item["bug_id"]);
                console.log(stat);
                container.appendChild(tr);
            }
        });
});
