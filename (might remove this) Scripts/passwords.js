// We initialize the array of usernames and associated passwords to the admin default (when website runs for the first time)
// We can retrieve from local storage the updated list of user credentials (whether it was removed, modified or added to)
var userCredentials = JSON.parse(localStorage.getItem('userCredentials')) || [
    {username: 'Admin1', password: 'password123'}
];

// Add email along with username and password in userCredentials, BUT when logging in user can use either email or username itself
// SHOULD WE MAKE AN INTERACTIVE PAGE WITH A TABLE FOR ADMIN TO VIEW THE USERCREDENTIALS

var remainingAttempts = 2;

// If Username is correct, user can proceed to resetPassword page
// If not correct, they should email Admin to get them to manually remove it (they can do this with the individuals email which they can't forget)
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


// Check the current password before we let the user enter the new password
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


// User can finally make the new password
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
        return true;
    } 
    else 
    {
        alert("User not found.");
        return false;
    }
}


/*
* Admin Functionalities
* Adding user to give them access to the Bug DataBase
* Removing a user to remove their access (Admin can't be removed)
*
* Ensure we know who is currently logged in (store it in a variable) and use this to decide whether or not to disable or enable functionality meant for Admin ONLY
*/

// Add a User
function register() {
    var username = document.getElementById('username').value;
    var password = document.getElementById('password').value;
    userCredentials.push({ username: username, password: password }); // username: Testing_User,  password: Testing_Pass
    localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
    window.location.href = "../Pages/main.html";
    return true;
}


// Remove a User
function remove() {
    var enteredUsername = document.getElementById('username').value;
    if (enteredUsername == 'Admin1') {
        return false; // Admin can't be removed
    }

    var userIndex = userCredentials.findIndex(function(credentials) {
        return credentials.username === enteredUsername;
    });

    if (userIndex != -1) {
        userCredentials.splice(userIndex, 1); // Removes
        localStorage.setItem('userCredentials', JSON.stringify(userCredentials));
        window.location.href = "../Pages/main.html"
        return true;
    }
    else {
        return false; // Can't remove a user that doesn't exist
    }
}