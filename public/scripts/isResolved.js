// this should figure out if a bug is resolved or not and render the bugView page accordingly

function checkBugStatus(bugId) {
    fetch(`/getBugStatus/${bugId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch bug status');
            }
            return response.json();
        })
        .then(data => {
            // Log the bug status (true if resolved, false if not)
            console.log('Bug Status:', data.isResolved);
            return data.isResolved;
        })
        .catch(error => {
            console.error('Error:', error);
        });
}

// this should import like this:

// import { checkIfResolved } from './isResolved.js';

// const bugId = 123; // Example bug ID
// const isResolved = checkIfResolved(bugId);