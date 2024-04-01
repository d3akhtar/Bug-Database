document.getElementById('resolveBug').addEventListener('click', async () => {
    event.preventDefault(); // Prevent default form submission

    const bugId = document.getElementById('bugId').value;
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;

    const response = await fetch('/resolveBugAndComment', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ bugId, title, description })
    });

    if (response.ok) {
        // Bug resolved and comment added successfully
        console.log('Bug resolved and comment added successfully');
    } else {
        // Error handling
        console.error('Failed to resolve bug and add comment');
    }
	console.log("yeet");
});
