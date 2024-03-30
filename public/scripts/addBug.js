document.getElementById('myButton').addEventListener('click', () => {
    // Make an AJAX request to the server-side endpoint
    const xhr = new XMLHttpRequest();
    xhr.open('GET', '/addBugAndComment', true);
    xhr.onreadystatechange = function() {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          console.log(xhr.responseText);
          // Optionally, do something with the response
        } else {
          console.error('Error:', xhr.status);
          // Optionally, handle errors
        }
      }
    };
    xhr.send();
});
