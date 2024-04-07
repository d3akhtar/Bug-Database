function createNavBar() {
  // Create nav element
  var nav = document.createElement("nav");

  // Create div element for the name
  var nameDiv = document.createElement("div");
  nameDiv.classList.add("name");
  nameDiv.textContent = "BugBytes";

  // Create ul element
  var ul = document.createElement("ul");

  // Create li element for Home
  var homeLi = document.createElement("li");
  homeLi.classList.add("nav-item");
  var homeLink = document.createElement("a");
  homeLink.classList.add("nav-link");
  homeLink.href = "../home.html";
  homeLink.textContent = "Home";
  homeLi.appendChild(homeLink);

  // Create li element for settings
  var settingsLi = document.createElement("li");
  settingsLi.classList.add("nav-item", "dropdown"); // Add classes for styling
  settingsLi.addEventListener("mouseenter", function() {
    toggleDropdown(true);
  });
  settingsLi.addEventListener("mouseleave", function() {
    toggleDropdown(false);
  });
  var settingsLink = document.createElement("a");
  settingsLink.classList.add("nav-link", "dropdown-toggle"); // Add classes for styling
  settingsLink.href = "#"; // Set href for dropdown
  settingsLink.textContent = "Settings"; // Use text content for "Settings"
  settingsLink.setAttribute("role", "button"); // Set role for accessibility
  settingsLink.setAttribute("aria-expanded", "false"); // Set aria-expanded for accessibility
  settingsLink.setAttribute("aria-haspopup", "true"); // Set aria-haspopup for accessibility
  var settingsIcon = document.createElement("i");
  settingsIcon.classList.add("bi", "bi-gear", "navbtn"); // Add classes for icon styling
  settingsLink.appendChild(settingsIcon);
  settingsLi.appendChild(settingsLink);

  // Create ul element for dropdown menu
  var dropdownMenuUl = document.createElement("ul");
  dropdownMenuUl.classList.add("dropdown-menu");
  dropdownMenuUl.setAttribute("aria-labelledby", "navbarDropdown"); // Set aria-labelledby for accessibility
  var toggleDarkModeLi = document.createElement("li");
  toggleDarkModeLi.innerHTML = "<a class='dropdown-item' href='#'>Sign Out</a>"; // Use Bootstrap dropdown-item class
  var signOutLi = document.createElement("li");
  signOutLi.innerHTML = "<a class='dropdown-item' href='../createPassword.html'>Change Password</a>"; // Use Bootstrap dropdown-item class and direct to resetPassword.html
  dropdownMenuUl.appendChild(toggleDarkModeLi);
  dropdownMenuUl.appendChild(signOutLi);
  settingsLi.appendChild(dropdownMenuUl);

  // Create li element for Help
  var helpLi = document.createElement("li");
  helpLi.classList.add("nav-item");
  var helpLink = document.createElement("a");
  helpLink.classList.add("nav-link");
  helpLink.href = "../FAQ.html";
  var helpSpan = document.createElement("span");
  helpSpan.style.fontSize = "large";
  helpSpan.style.position = "static";
  var helpIcon = document.createElement("i");
  helpIcon.classList.add("bi", "bi-question-circle", "navbtn");
  helpSpan.appendChild(helpIcon);
  helpLink.appendChild(helpSpan);
  helpLink.appendChild(document.createTextNode("Help"));
  helpLi.appendChild(helpLink);

  // Append all elements
  ul.appendChild(homeLi);
  ul.appendChild(settingsLi);
  ul.appendChild(helpLi);
  nav.appendChild(nameDiv);
  nav.appendChild(ul);

  // Append nav to the body
  document.body.insertBefore(nav, document.body.firstChild);
	console.log("made nav bar");
}

// Call the function to create the navbar
createNavBar();

// Function to toggle dropdown menu
function toggleDropdown(show) {
    var dropdownMenu = document.querySelector(".dropdown-menu");
    var settingsLink = document.querySelector(".dropdown-toggle");
    if (show) {
        dropdownMenu.style.display = "block";
        settingsLink.setAttribute("aria-expanded", "true");
    } else {
        dropdownMenu.style.display = "none";
        settingsLink.setAttribute("aria-expanded", "false");
    }
}

// Logout functionality
document.querySelector('.dropdown-menu a[href="#"]').addEventListener('click', () => {
    fetch('/logout', {
        method: 'POST',
        credentials: 'same-origin' // Include cookies in the request
    })
    .then(response => {
        if (response.ok) {
            // Redirect to resetPassword page after successful logout
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
