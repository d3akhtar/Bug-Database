function createNavBar() {
  // Create nav element
  var nav = document.createElement("nav");

  // Create div element for the name
  var nameDiv = document.createElement("div");
  nameDiv.classList.add("name");
  nameDiv.textContent = "BugBytes";

  // Create ul element
  var ul = document.createElement("ul");

  // Create li element for settings
  var settingsLi = document.createElement("li");
  var settingsSpan = document.createElement("span");
  settingsSpan.classList.add("dropdown-toggle");
  settingsSpan.setAttribute("onclick", "toggleDropdown()");
  var settingsIcon = document.createElement("i");
  settingsIcon.classList.add("bi", "bi-gear", "navbtn");
  settingsSpan.appendChild(settingsIcon);
  settingsLi.appendChild(settingsSpan);
  settingsLi.appendChild(document.createTextNode("Settings"));

  // Create ul element for dropdown menu
  var dropdownMenuUl = document.createElement("ul");
  dropdownMenuUl.classList.add("dropdown-menu");
  dropdownMenuUl.id = "dropdownMenu";
  var toggleDarkModeLi = document.createElement("li");
  toggleDarkModeLi.innerHTML = "<a href='#'>Toggle Dark/Light Mode</a>";
  var resetPasswordLi = document.createElement("li");
  resetPasswordLi.innerHTML = "<a href='#'>Change Password</a>";
  dropdownMenuUl.appendChild(toggleDarkModeLi);
  dropdownMenuUl.appendChild(resetPasswordLi);
  settingsLi.appendChild(dropdownMenuUl);

  // Create li element for Help
  var helpLi = document.createElement("li");
  var helpLink = document.createElement("a");
  helpLink.href = "FAQ.html";
  var helpSpan = document.createElement("span");
  helpSpan.style.fontSize = "large";
  helpSpan.style.position = "static";
  var helpIcon = document.createElement("i");
  helpIcon.classList.add("bi", "bi-question-circle", "navbtn");
  helpSpan.appendChild(helpIcon);
  helpLink.appendChild(helpSpan);
  helpLink.appendChild(document.createTextNode("Help"));
  helpLi.appendChild(helpLink);

  // Create li element for Sign Out
  var signOutLi = document.createElement("li");
  var signOutLink = document.createElement("a");
  var signOutSpan = document.createElement("span");
  signOutSpan.style.fontSize = "large";
  signOutSpan.style.position = "static";
  var signOutIcon = document.createElement("i");
  signOutIcon.classList.add("bi", "bi-box-arrow-right", "navbtn");
  signOutSpan.appendChild(signOutIcon);
  signOutLink.appendChild(signOutSpan);
  signOutLink.setAttribute("id", "logoutBtn");
  signOutLink.appendChild(document.createTextNode("Sign Out"));
  signOutLi.appendChild(signOutLink);

  // Append all elements
  ul.appendChild(settingsLi);
  ul.appendChild(helpLi);
  ul.appendChild(signOutLi);
  nav.appendChild(nameDiv);
  nav.appendChild(ul);

  // Append nav to the body
  document.body.insertBefore(nav, document.body.firstChild);
	console.log("made nav bar");
}

// Call the function to create the navbar
createNavBar();

document.getElementById('logoutBtn').addEventListener('click', () => {
            fetch('/logout', {
                method: 'POST',
                credentials: 'same-origin' // Include cookies in the request
            })
            .then(response => {
                if (response.ok) {
                    // Redirect to login page after successful logout
                    window.location.href = '../login.html';
                } else {
                    // Handle error responses
                    console.error('Error:', response.statusText);
                    alert('Failed to logout. Please try again.');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('An unexpected error occurred. Please try again later.');
            });
        });
