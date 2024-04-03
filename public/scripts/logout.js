// a thing that ends the session and goes to main page

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