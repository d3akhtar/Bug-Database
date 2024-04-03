document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch comments from the server
    const id = localStorage.getItem("bug_id");
    document.getElementById("bug-number-display").innerText = id;
    function fetchComments() {
        const url = `/getCommentsForBug?param=${encodeURIComponent(id)}`;

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

    const reportDetails = ["author", "title", "body", "dateAdded"];

    // Call fetchComments when the page is loaded
    fetchComments()
        .then(async items => {
            // Get the container div
            const container = document.getElementById('comments');

            // Loop through the items array and create a div for each item

            for (let i = 0; i < items.length; i++) {
                if (i == 0) {
                    container.innerHTML +=
                `
                    <div class="container bug-description-block" style="margin-top:80px; display:flex-box; width:70%; background-color: lightsalmon; padding: 80px; border: 4px solid black; border-radius: 30px;">
                            <div class="bug-description">
                                <h2 class="text-dark" style="font-weight:700">${items[i].comment_title}</h2>
                            </div>
                            <br>
                            <div class="bug-description">
                                <h3 class="text-dark">Details:</h3>
                                <p style="color: darkred;">${items[i].comment_body}</p>
                            </div><br><br>
                            <div class="buttons" style="display:flex; width:70%; margin:auto">
                                <button class="btn-outline-success" id="resolve-btn" style="width:250px; height:50px; margin: 0 auto">Resolve</button><br><br>
                                <button class="btn-outline-primary" id="add-activity-btn" style="width:250px; height:50px; margin: 0 auto">Add Activity</button>
                            </div>
                        </div>
                `
                } else {
                    container.innerHTML +=
                    `
                        <div class="container contribution-block p-4 w-70">
                            <h3 class="text-dark" style="font-weight:800; font-size: 40px;">${items[i].comment_title} - ${items[i].comment_dateAdded}</h3>
                            <h4 class="text-dark">${items[i].author_username}</h4>
                            <p>${items[i].comment_body}</p>
                        </div>
                    `
                }
            }

            const stat = await checkBugStatus(id);
            if (!stat) {
                // hide add and resolve buttons
                document.getElementById('updateBugButton').style.display = 'block';
                document.getElementById('resolveBugButton').style.display = 'block';
            }
        });
});