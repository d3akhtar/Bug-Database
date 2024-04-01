document.getElementById('userForm').addEventListener('submit', function(event) {
    console.log("submitted");

    event.preventDefault(); // Prevent default form submission
    // Get the selected action
    var action = document.getElementById('action').value;

    // Get the fields based on the selected action
    var fields;
    if (action === 'add') {
        console.log('add');
        fields = {
            email: document.getElementById('addEmail').value,
            username: document.getElementById('addUsername').value,
            password: document.getElementById('addPassword').value,
            confirmPassword: document.getElementById('addConfirmPassword').value
        };
    } else if (action === 'remove') {
        console.log('remove');
        fields = {
            username: document.getElementById('removeUsername').value,
            confirmRemove: document.getElementById('removeConfirmRemove').checked
        };
    } else if (action === 'change') {
        console.log('change');
        fields = {
            username: document.getElementById('passwordUsername').value,
            newPassword: document.getElementById('passwordNewPassword').value,
            confirmPassword: document.getElementById('passwordConfirmPassword').value
        };
    }

    // Check if any field is empty
    for (var key in fields) {
        if (!fields[key]) {
            alert('Some fields are empty');
            return;
        }
    }

    // Check if the selected action is still "Select Action"
    if (action === '') {
        alert('Select an action');
        return;
    }

    // Print the fields to the console
    console.log('Selected Action:', action);
    console.log('Fields:', fields);

    // Reset the form
    this.reset();
});
