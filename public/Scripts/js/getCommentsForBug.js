document.addEventListener('DOMContentLoaded', function() {
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
		if (i==0){	
			let j = 0;
			for (const key in items[i]) {
				document.getElementById(reportDetails[j]).innerText = items[i][key];
				j++;
			}
		} else{
		const item = items[i];
		const tr = document.createElement('tr');
		for (const key in item) {
			const td = document.createElement('td');
			td.innerText = item[key];
			tr.appendChild(td);
		}
		container.appendChild(tr);
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