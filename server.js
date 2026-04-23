const express = require('express');
const session = require('express-session');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON data
app.use(express.json());

// Serve your frontend files from the public folder
app.use(express.static('public')); 

// Set up the session to keep users logged in
app.use(session({
    secret: 'tic-tac-toe-secret', 
    resave: false,
    saveUninitialized: false
}));

// Path to your users data file
const usersFilePath = path.join(__dirname, 'data', 'users.json');

// --- ROUTES ---

// 1. REGISTER ROUTE
app.post('/api/register', (req, res) => {
    const { username, password } = req.body;

    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);

    const userExists = users.find(u => u.username === username);
    if (userExists) {
        return res.status(400).json({ error: 'Username already taken' });
    }

    users.push({ username, password });
    fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));

    res.json({ message: 'Registration successful!' });
});

// 2. LOGIN ROUTE (The code you just pasted!)
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;

    const usersData = fs.readFileSync(usersFilePath, 'utf8');
    const users = JSON.parse(usersData);

    const user = users.find(u => u.username === username && u.password === password);

    if (user) {
        req.session.username = username;
        res.json({ message: 'Login successful!' });
    } else {
        res.status(401).json({ error: 'Invalid credentials' });
    }
});

// 3. LOGOUT ROUTE (The code you just pasted!)
app.post('/api/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Logged out successfully' });
});

// --- START THE SERVER ---
// (This must always be at the bottom!)
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});