document.addEventListener('DOMContentLoaded', function() {
    // Function to fetch comments from the server
    function fetchComments() {
	const order= 'ORDER BY b.dateModified DESC';
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

    // Call fetchComments when the page is loaded
    fetchComments()
        .then(items => {
            // Get the container div
            const container = document.getElementById('bugTable');

            // Loop through the items array and create a div for each item
            items.forEach(item => {
                const tr = document.createElement('tr');
                for (const key in item) {
                    const td = document.createElement('td');
                    td.innerText = item[key];
                    tr.appendChild(td);
                }
                container.appendChild(tr);
            });
        });
});