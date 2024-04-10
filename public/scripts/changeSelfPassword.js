function checkCurrentPassword() {
    const currentPassword = document.getElementById('currentPassword').value;

    // Make AJAX request to server to check current password
    fetch('/checkCurrentPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ currentPassword })
    })
        .then(response => {
            if (response.status === 200) {
                // Enable new password fields if current password is correct
                console.log("you wrote the correct password");
                // changing password here:
                createPassword();

            } else if (response.status === 401) {
                // Unauthorized - you are not logged in
                alert("you're not logged in");
            } else if (response.status === 404) {
                // Unauthorized - user not found
                alert("password is incorrect");
            } else {
                // Handle other response statuses if needed
                console.error('Unexpected response status:', response.status);
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while checking the current password');
        });
    console.log("yeet");
}

function createPassword() {
    const newPassword = document.getElementById('newPassword').value;
    const confirmNewPassword = document.getElementById('confirmNewPassword').value;

    // Check if new passwords match
    if (!isStrongPassword(newPassword)) {
        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                cancelButton: "btn w-25"
            },
            buttonsStyling: false
        });

        swalWithBootstrapButtons.fire({
            title: "Weak Password!",
            showCancelButton: true,
            cancelButtonColor: "#d33",
            cancelButtonText: "OK",
            showConfirmButton:false,
            html: `<p style="color: white; text-align:center;">Make sure to have more than 7 characters, including an uppercase, lowercase, number, and special character<p>`,
            timer: 2500,
            timerProgressBar: true,
        }).then((result) => {
            /* Read more about handling dismissals below */
            if (result.dismiss === Swal.DismissReason.timer) {
                console.log("I was closed by the timer");
            }
        });
	return;
    }
    if (newPassword !== confirmNewPassword) {
        alert("New passwords do not match");
        return false; // Prevent form submission
    }

    // Make AJAX request to server to create new password
    fetch('/createPassword', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ newPassword })
    })
        .then(response => {
            if (response.ok) {
                alert("Password changed successfully");
                window.location.href = '/home.html';
                // Optionally, do something with the response
            } else {
                alert("Failed to create password");
            }
        })
        .catch(error => {
            console.error('Error:', error);
            alert('An error occurred while creating the password');
        });

    return false; // Prevent form submission
}


function isStrongPassword(password) {
    if (password.length < 8) {
        return false;
    }

    if (!/[A-Z]/.test(password)) {
        return false;
    }

    if (!/[a-z]/.test(password)) {
        return false;
    }

    if (!/\d/.test(password)) {
        return false;
    }

    if (!/[!@#$%^&*()_+{}[\]:;<>,.?/\\|`~-]/.test(password)) {
        return false;
    }

    return true;
}

function strength(password) {
    if (isStrongPassword(password)) {
        return "Strong";
    } else {
        return "Weak";
    }
}