document.addEventListener('DOMContentLoaded', function() {
  // Function to fetch comments from the server
  function fetchComments() {
    fetch('/getCommentsForBug')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch comments');
        }
        return response.json();
      })
      .then(comments => {
        console.log('Comments:', comments);
        // You can do something with the comments here, such as displaying them on the page
      })
      .catch(error => {
        console.error('Error:', error);
      });
  }

  // Call fetchComments when the page is loaded
  fetchComments();
});