
document.getElementById('userForm').addEventListener('submit', function (event) {
	console.log("submitted");

	event.preventDefault(); // Prevent default form submission
	// Get the selected action
	var action = document.getElementById('action').value;

	// Check if the selected action is still "Select Action"
	if (action === '') {
		alert('Select an action');
		return;
	}

	// Get the fields based on the selected action
	var fields;
	if (action === 'add') {
		console.log('add');

		fields = {
			email: document.getElementById('addEmail').value,
			username: document.getElementById('addUsername').value,
			password: document.getElementById('addPassword').value,
			confirmPassword: document.getElementById('addConfirmPassword').value,
			adminSetting: document.getElementById('addAsAdmin').checked
		};
		if (fields.username.length == 0) {
			alert("enter a username");
		}
		if (fields.username.length > 8) {
			alert("username is too long");
			return;
		}
		if (fields.email.length > 255) {
			alert("email is too long");
			return;
		}
		if (!isStrongPassword(fields.password)){
			alert("this password is not strong");
			return;
		}
		if (fields.password != fields.confirmPassword) {
			alert("passwords don't match");
			return;
		}

		Swal.fire({
			title: "Are you sure?",
			text: `User "${fields.username}" will be added.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, add user!"
		}).then((result) => {
			if (result.isConfirmed) {
				// Make an AJAX request to the server-side endpoint
				const xhr = new XMLHttpRequest();

				xhr.open('POST', '/addUser', true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.onreadystatechange = function () {
					if (xhr.readyState === XMLHttpRequest.DONE) {
						if (xhr.status === 200) {
							console.log(xhr.responseText);
							alert(`${fields.username} was added successfully`);
							return;
							// Optionally, do something with the response
						} else if (xhr.status === 404) {
							alert("You do not have permission to make these changes");
							return;
						} else if (xhr.status === 409) {
							alert("Username is already taken");
							return;
						} else if (xhr.status === 410) {
							alert("Email is already taken");
							return;
						} else if (xhr.status === 500) {
							alert("Internal server error");
							return;
						} else {
							alert("error adding User");
							console.error('Error:', xhr.status);
							return;
							// Optionally, handle errors
						}
					}
				};
				xhr.send(JSON.stringify(fields));
			}
		});

	} else if (action === 'remove') {
		console.log('remove');

		fields = {
			username: document.getElementById('removeUsername').value,
		};

		if (fields.username.length > 8) {
			alert("username is too long");
			return;
		} else if ((fields.username).toLowerCase() == "deleted user") {

		}

		Swal.fire({
			title: "Are you sure?",
			text: `User "${fields.username}" will be removed.`,
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, remove user!"
		}).then((result) => {
			if (result.isConfirmed) {

				// Make an AJAX request to the server-side endpoint
				const xhr = new XMLHttpRequest();

				xhr.open('POST', '/removeUser', true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.onreadystatechange = function () {
					if (xhr.readyState === XMLHttpRequest.DONE) {
						if (xhr.status === 200) {
							console.log(xhr.responseText);
							alert(`${fields.username} was removed successfully`);
							return;
							// Optionally, do something with the response
						} else if (xhr.status === 401) {
							alert("You do not have permission to make these changes");
							return;
						} else if (xhr.status === 404) {
							alert("Username was not found");
							return;
						} else if (xhr.status === 400) {
							alert("Cannot remove yourself");
							return;
						} else if (xhr.status === 500) {
							alert("Internal server error");
							return;
						} else {
							alert("error removing User");
							console.error('Error:', xhr.status);
							return;
							// Optionally, handle errors
						}
					}
				};
				xhr.send(JSON.stringify(fields));
			}
		});

	} else if (action === 'change') {
		console.log('change');

		fields = {
			username: document.getElementById('passwordUsername').value,
			newPassword: document.getElementById('passwordNewPassword').value,
			confirmPassword: document.getElementById('passwordConfirmPassword').value
		};

		if (fields.username.length > 8) {
			alert("username is too long");
			return;
		}
		if (!isStrongPassword(fields.newPassword)){
			alert("this password is not strong");
			return;
		}
		if (fields.newPassword != fields.confirmPassword) {
			alert("passwords don't match");
			return;
		}
		Swal.fire({
			title: "Are you sure?",
			icon: "warning",
			showCancelButton: true,
			confirmButtonColor: "#3085d6",
			cancelButtonColor: "#d33",
			confirmButtonText: "Yes, change password!"
		}).then((result) => {
			if (result.isConfirmed) {
				// Make an AJAX request to the server-side endpoint
				const xhr = new XMLHttpRequest();

				xhr.open('POST', '/changeUserPassword', true);
				xhr.setRequestHeader('Content-Type', 'application/json');
				xhr.onreadystatechange = function () {
					if (xhr.readyState === XMLHttpRequest.DONE) {
						if (xhr.status === 200) {
							console.log(xhr.responseText);
							alert(`${fields.username}\'s password changed successfully`);
							return;
							// Optionally, do something with the response
						} else if (xhr.status === 401) {
							alert("You do not have permission to make these changes");
							return;
						} else if (xhr.status === 404) {
							alert("Username was not found");
							return;
						} else if (xhr.status === 500) {
							alert("Internal server error");
							return;
						} else {
							alert("error removing User");
							console.error('Error:', xhr.status);
							return;
							// Optionally, handle errors
						}
					}
				};
				xhr.send(JSON.stringify(fields));
			}
		});

	}

	// Print the fields to the console
	console.log('Selected Action:', action);
	console.log('Fields:', fields);

	// clear current form
	const selectElement = document.getElementById('action');
	const selectedOption = selectElement.options[selectElement.selectedIndex];
	const selectedValue = selectedOption.value;
	this.reset();
	selectElement.value = selectedValue;
});

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

