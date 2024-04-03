document.getElementById('addReport').addEventListener('click', () => {
    const bugTitle = document.getElementById('bugTitle').value;
    const bugDescription = document.getElementById('bugDescription').value;

    // Make an AJAX request to the server-side endpoint
    const xhr = new XMLHttpRequest();

    xhr.open('POST', '/addBugAndComment', true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
	  window.location.href = "../home.html"
          // Optionally, do something with the response
        } else {
	alert("error adding bug");
          console.error('Error:', xhr.status);
          // Optionally, handle errors
        }
      }
    };
    xhr.send(JSON.stringify({ title: bugTitle, description: bugDescription }));
});