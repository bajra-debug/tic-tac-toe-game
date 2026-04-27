document.getElementById("btn-register").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();
    alert(data.message || data.error);
});

document.getElementById("btn-login").addEventListener("click", async () => {
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
    });
    const data = await response.json();

    if (response.ok) {
        document.getElementById("auth-section").style.display = "none";
        document.getElementById("logged-in-section").style.display = "block";
        document.getElementById("welcome-message").innerText =
            `Welcome, ${username}!`;
    } else {
        alert(data.error);
    }
});

document.getElementById("btn-logout").addEventListener("click", async () => {
    const response = await fetch("/api/logout", { method: "POST" });
    const data = await response.json();

    document.getElementById("auth-section").style.display = "block";
    document.getElementById("logged-in-section").style.display = "none";
    document.getElementById("username").value = "";
    document.getElementById("password").value = "";
    alert(data.message);
});
// --- Tic Tac Toe Game Logic ---
document.addEventListener('DOMContentLoaded', () => {
    const board = document.getElementById('board');
    const status = document.getElementById('status');
    let currentPlayer = 'X';
    let gameState = ['', '', '', '', '', '', '', '', ''];
    let gameActive = true;

    const winningConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
        [0, 4, 8], [2, 4, 6]             // diagonals
    ];

    // Create the board
    for (let i = 0; i < 9; i++) {
        const cell = document.createElement('div');
        cell.classList.add('cell');
        cell.setAttribute('data-index', i);
        cell.addEventListener('click', handleCellClick);
        board.appendChild(cell);
    }

    function handleCellClick(e) {
        const clickedCell = e.target;
        const clickedCellIndex = parseInt(clickedCell.getAttribute('data-index'));

        if (gameState[clickedCellIndex] !== '' || !gameActive) {
            return;
        }

        gameState[clickedCellIndex] = currentPlayer;
        clickedCell.textContent = currentPlayer;

        checkResult();
    }

    function checkResult() {
        let roundWon = false;

        for (let i = 0; i < winningConditions.length; i++) {
            const [a, b, c] = winningConditions[i];
            if (gameState[a] === '' || gameState[b] === '' || gameState[c] === '') {
                continue;
            }
            if (gameState[a] === gameState[b] && gameState[b] === gameState[c]) {
                roundWon = true;
                break;
            }
        }

        if (roundWon) {
            status.textContent = `Player ${currentPlayer} wins!`;
            gameActive = false;
            return;
        }

        if (!gameState.includes('')) {
            status.textContent = "Game ended in a draw!";
            gameActive = false;
            return;
        }

        currentPlayer = currentPlayer === 'X' ? 'O' : 'X';
        status.textContent = `Current player: ${currentPlayer}`;
    }
});
