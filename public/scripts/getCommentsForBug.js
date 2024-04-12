function extractIntegerFromString(str) {
    // Regular expression to match the pattern [n]
    var regex = /\[(\d+)\]/;

    // Match the pattern in the string
    var match = str.match(regex);

    // Check if a match is found
    if (match) {
        // Extract the integer from the matched group
        var integer = parseInt(match[1]);
        return integer;
    } else {
        // No match found
        return null;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    // Function to fetch comments from the server
    const elem = document.getElementById("bug-number-display").textContent;
    const id = extractIntegerFromString(elem);
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

    const reportDetails = ["author", "title", "description", "dateAdded"];

    // Call fetchComments when the page is loaded
    fetchComments()
        .then(async items => {
            // Get the container div
            const container = document.getElementById('comments');
            const details = document.getElementById("details")

            // Loop through the items array and create a div for each item


            for (let i = 0; i < items.length; i++) {
                const item = items[i];
                const { author_username, comment_title, comment_body, comment_dateAdded } = item;
                if (i == 0) {
                    details.innerHTML +=
                        ` <div class="formCont bug-description-block" style="margin-top:0px; display:flex-box; width:70%; padding: 80px; border-radius: 30px; color:white;">
                            <div class="bug-description">
                                <h2 style="font-weight:700;">${author_username}: [${comment_title}]</h2>
                            </div>
                            <br>
                            <div class="bug-description">
                                <h3>Description:</h3>
                                <p>${comment_body}</p>
                            </div><br><br>
                            <div id="contribute-btn-block" style="text-align: center;">
                                <button id="show-comment-form-btn" onclick="showContributionForm()">Contribute</button>
                            </div>
                        </div>`
                } else {

                    /// this part is the one that fetches the comment data
                    // order: [author_username, comment_title, comment_body, comment_dateAdded]

                    const item = items[i];
                    const { author_username, comment_title, comment_body, comment_dateAdded } = item;
                    container.innerHTML +=
                        `<div class="container contribution-block p-4 w-70">
                            <h3 class="text-dark" style="font-weight:800; font-size: 40px;">${author_username}: [${comment_title}]</h3>
                            <h4 class="text-dark">${comment_body}</h4>
                        </div>`
                    /// this part is the one that fetches the comment data
                }
            }

            const stat = await checkBugStatus(id);
            if (!stat) {
                // show add and resolve buttons when not resolved
                document.getElementById('contribute-btn-block').style.display = 'block';
            } else {
                // show resolved tag
                document.getElementById('resolvedTag').style.display = 'block';
                document.getElementById('contribute-btn-block').style.display = 'none';
            }
        });
});
