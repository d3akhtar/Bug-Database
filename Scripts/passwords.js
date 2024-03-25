// We initialize the array of usernames and associated passwords to the admin default (when website runs for the first time)
// We can retrieve from local storage the updated list of user credentials (whether it was removed, modified or added to)
var userCredentials = JSON.parse(localStorage.getItem('userCredentials')) || [
    {username: 'Admin1', password: 'password123'}
];

var remainingAttempts = 2;

function checkUsername(event) {
    event.preventDefault();

    var enteredUsername = document.getElementById('username').value;

    // Check if the username is in the database
    var isValidUsername = userCredentials.some(function(credentials) {
        return credentials.username == enteredUsername;
    });

    if (isValidUsername) {
        // We need to send the username to the next page for use
        window.location.href = "createPassword.html?username=" + encodeURIComponent(enteredUsername);
    }
    else {
        var button = document.getElementById('userCheck');

        if (remainingAttempts > 0) {
            remainingAttempts--;
            button.textContent = remainingAttempts + " attempts remaining";
        }
        else {
            button.disabled = true;
            button.textContent = "No such Username (admin has been emailed)";
        }
    }
}


function checkCurrentPassword() {
    // Only the currentPassword has been enabled so we get input from it
    var currentPassword = document.getElementById('currentPassword').value;

    // Find password match in userCredentials
    var userIndex = userCredentials.findIndex(function(credentials) {
        return credentials.password === currentPassword;
    });

    if (userIndex !== -1) {
        // Enable the input fields if current password matches
        document.getElementById('newPassword').disabled = false;
        document.getElementById('confirmNewPassword').disabled = false;

        document.getElementById('newPassword').focus();

        // Hide the button
        document.getElementById('passwordForm').querySelector('button').style.display = 'none';

        // Make the button visible
        document.getElementById('nextButton').style.display = 'block';
    } 
    else {
        alert("Incorrect current password. Please try again.");
    }
}


function createPassword() {
    // We will be collecting the new passwords
    var newPassword = document.getElementById('newPassword').value;
    var confirmNewPassword = document.getElementById('confirmNewPassword').value;

    if (newPassword !== confirmNewPassword) {
        alert("Passwords do not match. Please try again.");
        return false;
    }

    // Get the username that was entered on the previous page
    var urlParams = new URLSearchParams(window.location.search);
    var enteredUsername = urlParams.get('username');

    // Find the username match so we can use that to change the password
    var userIndex = userCredentials.findIndex(function(credentials) {
        return credentials.username === enteredUsername;
    });

    if (userIndex !== -1) {
        userCredentials[userIndex].password = newPassword;
        localStorage.setItem('userCredentials', JSON.stringify(userCredentials)); 
        window.location.href = "../Pages/login.html";
        return false;
    } 
    else 
    {
        alert("User not found.");
        return false;
    }
}


function register() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    userCredentials.push({ username: username, password: password });
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
}