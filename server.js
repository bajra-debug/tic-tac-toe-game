const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static("public"));

app.use(
    session({
        secret: "tic-tac-toe-secret",
        resave: false,
        saveUninitialized: false,
    }),
);

const usersFilePath = path.join(__dirname, "data", "users.json");

// --- CP01: Hello World Route ---
app.get("/api/hello", (req, res) => {
    res.json({ message: "Hello World!" });
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
        (u) => u.username === username && u.password === password,
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

// Start Server (with 0.0.0.0 for Replit preview)
app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
