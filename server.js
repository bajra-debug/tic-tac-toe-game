const express = require('express');
const path = require('path');
const session = require('express-session');
const bcrypt = require('bcryptjs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: 'your-secret-key',
  resave: false,
  saveUninitialized: true,
}));

// Mock database
const users = [];

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cp01-world', 'index.html'));
});

app.get('/cp01-world', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cp01-world', 'index.html'));
});

app.get('/cp02-accounts/register', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cp02-accounts', 'register.html'));
});

app.post('/cp02-accounts/register', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.redirect('/cp02-accounts/login');
});

app.get('/cp02-accounts/login', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'cp02-accounts', 'login.html'));
});

app.post('/cp02-accounts/login', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    req.session.user = user;
    res.redirect('/cp02-accounts/dashboard');
  } else {
    res.redirect('/cp02-accounts/login?error=1');
  }
});

app.get('/cp02-accounts/dashboard', (req, res) => {
  if (!req.session.user) {
    return res.redirect('/cp02-accounts/login');
  }
  res.send(`<h1>Welcome, ${req.session.user.username}!</h1><a href="/cp02-accounts/logout">Logout</a>`);
});

app.get('/cp02-accounts/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
