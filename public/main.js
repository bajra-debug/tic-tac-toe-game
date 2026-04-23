
// --- REGISTRATION ---
document.getElementById('btn-register').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();
    alert(data.message || data.error);
});

// --- LOGIN ---
document.getElementById('btn-login').addEventListener('click', async () => {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
    });

    const data = await response.json();

    if (response.ok) {
        // Hide the login form, show the logout button
        document.getElementById('auth-section').style.display = 'none';
        document.getElementById('logged-in-section').style.display = 'block';
        document.getElementById('welcome-message').innerText = `Welcome, ${username}!`;
    } else {
        alert(data.error);
    }
});

// --- LOGOUT ---
document.getElementById('btn-logout').addEventListener('click', async () => {
    const response = await fetch('/api/logout', { method: 'POST' });
    const data = await response.json();

    // Show the login form again
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('logged-in-section').style.display = 'none';
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    alert(data.message);
});