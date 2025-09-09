const apiUrl = 'http://localhost:5000/api/auth';

function register() {
    const username = document.getElementById('regUsername').value;
    const password = document.getElementById('regPassword').value;

    fetch(`${apiUrl}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(data => document.getElementById('message').innerText = data)
    .catch(err => console.log(err));
}

function login() {
    const username = document.getElementById('loginUsername').value;
    const password = document.getElementById('loginPassword').value;

    fetch(`${apiUrl}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    })
    .then(res => res.text())
    .then(data => document.getElementById('message').innerText = data)
    .catch(err => console.log(err));
}
