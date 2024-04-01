// Check login status when the page is loaded
  // Make an AJAX request to check login status
  const xhr = new XMLHttpRequest();
  xhr.open('GET', '/checkLogin', true);
  xhr.onreadystatechange = function() {
    if (xhr.readyState === XMLHttpRequest.DONE) {
      if (xhr.status === 200) {
        // User is logged in, do nothing
      } else {
        // User is not logged in, redirect to login page
        window.location.href = '/login.html';
      }
    }
  };
  xhr.send();
