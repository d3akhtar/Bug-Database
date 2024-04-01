// Define an array of items
const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

// Get the container div
const container = document.getElementById('container');

// Loop through the items array and create a div for each item
items.forEach(item => {
    // Create a new div element
    const div = document.createElement('div');
    // Set the inner text of the div to the current item
    div.innerText = item;
    // Append the div to the container
    container.appendChild(div);
});
