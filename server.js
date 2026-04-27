const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
  session({
    secret: "your-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// --- Data Storage (JSON files) ---
const usersFilePath = path.join(__dirname, "data", "users.json");
const sessionsFilePath = path.join(__dirname, "data", "sessions.json");

// Ensure data directory and files exist
if (!fs.existsSync(path.dirname(usersFilePath))) {
  fs.mkdirSync(path.dirname(usersFilePath), { recursive: true });
}

if (!fs.existsSync(usersFilePath)) {
  fs.writeFileSync(usersFilePath, JSON.stringify([]));
}

if (!fs.existsSync(sessionsFilePath)) {
  fs.writeFileSync(sessionsFilePath, JSON.stringify([]));
}

// --- CP01: Hello World Route ---
app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.get("/cp01-world", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cp01-world", "index.html"));
});

// --- CP02: Auth Routes ---
app.post("/api/register", (req, res) => {
  const { username, password } = req.body;
  const usersData = fs.readFileSync(usersFilePath, "utf8");
  const users = JSON.parse(usersData);

  if (users.find((u) => u.username === username)) {
    return res.status(400).json({ error: "Username already taken" });
  }

  users.push({ username, password });
  fs.writeFileSync(usersFilePath, JSON.stringify(users, null, 2));
  res.json({ message: "Registration successful!" });
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const usersData = fs.readFileSync(usersFilePath, "utf8");
  const users = JSON.parse(usersData);

  const user = users.find(
    (u) => u.username === username && u.password === password
  );
  if (user) {
    req.session.username = username;
    res.json({ message: "Login successful!" });
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

app.post("/api/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Logged out successfully" });
});

// --- CP01: Basic Setup Page ---
app.get("/cp01-world", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cp01-world", "index.html"));
});

// --- CP02: Register and Login Pages ---
app.get("/cp02-accounts/register", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cp02-accounts", "register.html"));
});

app.get("/cp02-accounts/login", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "cp02-accounts", "login.html"));
});

app.get("/cp02-accounts/dashboard", (req, res) => {
  if (!req.session.username) {
    return res.redirect("/cp02-accounts/login");
  }
  res.send(`<h1>Welcome, ${req.session.username}!</h1><a href="/cp02-accounts/logout">Logout</a>`);
});

app.get("/cp02-accounts/logout", (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// --- Start Server (with 0.0.0.0 for Replit preview) ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
  console.log("Visit: http://localhost:3000/cp01-world");
});
