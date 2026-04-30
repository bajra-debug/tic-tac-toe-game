const express = require("express");
const session = require("express-session");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;

// --- Middleware ---
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public")); // Serves everything in /public

app.use(
  session({
    secret: "tic-tac-toe-secret",
    resave: false,
    saveUninitialized: false,
  })
);

// --- Data Storage (JSON files) ---
const usersFilePath = path.join(__dirname, "data", "users.json");
const sessionsFilePath = path.join(__dirname, "data", "sessions.json");
const gamesFilePath = path.join(__dirname, "data", "games.json"); // Added games.json

// Automatically create files if they don't exist
if (!fs.existsSync(path.dirname(usersFilePath))) {
  fs.mkdirSync(path.dirname(usersFilePath), { recursive: true });
}
if (!fs.existsSync(usersFilePath)) fs.writeFileSync(usersFilePath, JSON.stringify([]));
if (!fs.existsSync(sessionsFilePath)) fs.writeFileSync(sessionsFilePath, JSON.stringify([]));
if (!fs.existsSync(gamesFilePath)) fs.writeFileSync(gamesFilePath, JSON.stringify([])); // Creates games.json

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

  const user = users.find((u) => u.username === username && u.password === password);

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

// --- CP05: Save Game Route ---
app.post("/api/save-game", (req, res) => {
  console.log("🚨 The server just received a save request!");
  const incomingGameData = req.body;

  fs.readFile(gamesFilePath, "utf8", (err, fileData) => {
    let allGames = [];
    if (!err && fileData) {
      try {
        allGames = JSON.parse(fileData);
      } catch (e) {
        console.error("🚨 Error parsing games.json");
      }
    }

    // Add the new game
    allGames.push({
      id: Date.now(),
      board: incomingGameData.board,
      turn: incomingGameData.currentPlayer,
      timestamp: new Date().toLocaleString()
    });

    // Write back to the file
    fs.writeFile(gamesFilePath, JSON.stringify(allGames, null, 2), (err) => {
      if (err) {
        console.error("🚨 Error writing to file:", err);
        return res.status(500).json({ message: "Failed to save." });
      }
      console.log("✅ Game successfully saved to data/games.json!");
      res.json({ message: "Game saved!" });
    });
  });
});

// --- Start Server ---
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🟢 Server running on port ${PORT} - Combined CP02 + CP05 ACTIVE!`);
});