window.addEventListener('pageshow', function(event) {
    // Check if the event's persisted property is false
    console.log("reloading");
    if (event.persisted) {
        // Reload the page
        window.location.reload();
    }
});

// Check login status when the page is loaded
// Make an AJAX request to check login status
const xhr = new XMLHttpRequest();
xhr.open('GET', '/checkLogin', true);
xhr.onreadystatechange = function () {
  if (xhr.readyState === XMLHttpRequest.DONE) {
    if (xhr.status === 200) {
      // User is logged in, go to home page
      window.location.href = '/home.html';
    } else {
      // User is not logged in, do nothing
    }
  }
};
xhr.send();
