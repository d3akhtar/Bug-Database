document.addEventListener('DOMContentLoaded', function () {
    console.log("reloading?");
    document.getElementById("action").selectedIndex = 0;

    // Reset all input fields
    var inputFields = document.querySelectorAll('input');
    inputFields.forEach(function (input) {
        input.value = '';
    });

    // Reset all textareas
    var textAreas = document.querySelectorAll('textarea');
    textAreas.forEach(function (textarea) {
        textarea.value = '';
    });

    // Uncheck all checkboxes
    var checkboxes = document.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach(function (checkbox) {
        checkbox.checked = false;
    });
});

function addRequirement(div) {
    console.log(div);
    const divElement = document.getElementById(div);

    const inputElements = divElement.querySelectorAll('input');
    inputElements.forEach(input => {
        input.required = true;
    });
}
function removeRequirement(div) {
    const divElement = document.getElementById(div);

    const inputElements = divElement.querySelectorAll('input');
    inputElements.forEach(input => {
        input.required = false;
    });
}

document.getElementById('action').addEventListener('change', function () {
    var selectedAction = this.value;
    var userFields = document.getElementById('userFields');
    var addUserFields = document.getElementById('addUserFields');
    var removeUserFields = document.getElementById('removeUserFields');
    var changePasswordFields = document.getElementById('changePasswordFields');

    if (selectedAction === 'add') {
        addUserFields.style.display = 'block';
        removeUserFields.style.display = 'none';
        changePasswordFields.style.display = 'none';

        addRequirement(addUserFields.id);
        document.getElementById('addAsAdmin').required = false;
        removeRequirement(removeUserFields.id);
        removeRequirement(changePasswordFields.id);
    } else if (selectedAction === 'remove') {
        addUserFields.style.display = 'none';
        removeUserFields.style.display = 'block';
        changePasswordFields.style.display = 'none';

        removeRequirement(addUserFields.id);
        addRequirement(removeUserFields.id);
        removeRequirement(changePasswordFields.id);
    } else if (selectedAction === 'change') {
        addUserFields.style.display = 'none';
        removeUserFields.style.display = 'none';
        changePasswordFields.style.display = 'block';

        removeRequirement(addUserFields.id);
        removeRequirement(removeUserFields.id);
        addRequirement(changePasswordFields.id);
    }
    console.log(addUserFields);
});