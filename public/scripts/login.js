document.getElementById('loginBtn').addEventListener('click', async () => {
	const username = document.getElementById('username').value;
	const password = document.getElementById('password').value;
	const rememberMe = document.getElementById('rememberMe').checked;
	console.log(rememberMe);

	const response = await fetch('/login', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({ username, password, rememberMe })
	});
	if (response.ok) {
		window.location.href = '/dashboard';
	} else {
		alert('Invalid username or password');
	}
});