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

document.getElementById('resolveBugButton').addEventListener('click', async () => {
    event.preventDefault(); // Prevent default form submission

    const elem = document.getElementById("bug-number-display").textContent;
    const bugId = extractIntegerFromString(elem);
    const title = document.getElementById('inputTitle').value;
    const description = document.getElementById('inputDescription').value;
	console.log(bugId);

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
	document.getElementById('updateBugButton').style.display = 'none';
	document.getElementById('resolveBugButton').style.display = 'none';
	window.location.href = "../home.html"
    } else {
        // Error handling
        console.error('Failed to resolve bug and add comment');
    }
	console.log("yeet");
});
