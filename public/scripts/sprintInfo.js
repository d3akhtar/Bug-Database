// Assuming you have input fields with ids 'startDate' and 'endDate' in your HTML

// Event listener for when the user clicks a button to submit the dates
document.getElementById('submitDatesBtn').addEventListener('click', async () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;

    // Make an AJAX request to the server with the start and end dates
    const response = await fetch('/sprintDetails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ startDate, endDate })
    });

    if (response.ok) {
        const bugReports = await response.json();
        console.log('Bug reports retrieved successfully:', bugReports);
        // Process the bug reports as needed
	// code to draw graph can go here

    } else {
        console.error('Error retrieving bug reports:', response.status);
        // Handle the error
    }
});