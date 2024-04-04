document.addEventListener("DOMContentLoaded", function() {
  // Create an XMLHttpRequest object
  var xhr = new XMLHttpRequest();

  // Configure the request
  xhr.open('GET', '/isAdmin', true);

  // Setup a callback function to handle the response
  xhr.onload = function() {
    if (xhr.status >= 200 && xhr.status < 300) {
      // Request was successful, print the response to the console
	console.log("text here");
	console.log(xhr.responseText);
      if (xhr.responseText === "true"){
	addAdminPanelLink()
      }
    } else {
      // Request failed
      console.log("fail");
      console.error('Request failed with status:', xhr.status);
    }
  };

  // Setup a callback function to handle errors
  xhr.onerror = function() {
    console.error('Request failed');
  };

  // Send the request
  xhr.send();
});

function addAdminPanelLink() {
  // Create a new list item element
  var listItem = document.createElement("li");

  // Create a new anchor element
  var anchor = document.createElement("a");
  anchor.textContent = "Admin Panel";
  anchor.setAttribute("onClick", "moveToAdminPanel()");

  // Append the anchor element to the list item
  listItem.appendChild(anchor);

  // Find the ul element with id "dropdownMenu"
  var dropdownMenu = document.getElementById("dropdownMenu");

  // Append the list item to the dropdown menu
  dropdownMenu.appendChild(listItem);
}