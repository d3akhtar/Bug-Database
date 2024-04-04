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


document.getElementById('updateBugButton').addEventListener('click', () => {
    event.preventDefault(); // Prevent default form submission

    const elem = document.getElementById("bug-number-display").textContent;
    const bugId = extractIntegerFromString(elem);
    const title = document.getElementById('inputTitle').value;
    const description = document.getElementById('inputDescription').value;

    // Make an AJAX request to the server-side endpoint
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/updateBug', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log('Bug report updated successfully');
	  window.location.href = "../home.html"

          // Optionally, do something with the response
        } else {
          console.error('Failed to update bug report');
          // Optionally, handle errors
        }
      }
    };
    xhr.send(JSON.stringify({ bugId, title, description }));
});
