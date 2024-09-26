let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;
let difficulty = "easy";

window.onload = function () {
  loadGameState();
  renderBoard();
};

function setDifficulty() {
  difficulty = document.getElementById("difficulty").value;
  localStorage.setItem("difficulty", difficulty);
}

function makeMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  document.querySelectorAll(".cell")[index].textContent = currentPlayer;

  if (checkWinner()) {
    document.getElementById("message").textContent = `${currentPlayer} venceu!`;
    gameActive = false;
  } else if (board.every((cell) => cell)) {
    document.getElementById("message").textContent = "Empate!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }

  saveGameState();

  if (currentPlayer === "O") {
    setTimeout(makeAIMove, 500);
  }
}

function makeAIMove() {
  let aiMove;

  if (difficulty === "easy") {
    aiMove = easyAIMove();
  } else if (difficulty === "medium") {
    aiMove = mediumAIMove();
  } else {
    aiMove = hardAIMove();
  }

  if (aiMove !== null) {
    board[aiMove] = currentPlayer;
    document.querySelectorAll(".cell")[aiMove].textContent = currentPlayer;
  }

  if (checkWinner()) {
    document.getElementById("message").textContent = `${currentPlayer} venceu!`;
    gameActive = false;
  } else if (board.every((cell) => cell)) {
    document.getElementById("message").textContent = "Empate!";
    gameActive = false;
  } else {
    currentPlayer = "X";
  }

  saveGameState();
}

function easyAIMove() {
  const emptyCells = board.map((cell, index) => cell === "" ? index : null).filter((index) => index !== null);
  return emptyCells[Math.floor(Math.random() * emptyCells.length)];
}

function mediumAIMove() {
  if (Math.random() > 0.5) {
    return easyAIMove();
  } else {
    return getBlockingMove() || easyAIMove();
  }
}

function hardAIMove() {
  return getWinningMove() || getBlockingMove() || easyAIMove();
}

function getWinningMove() {
  return findBestMove("O");
}

function getBlockingMove() {
  return findBestMove("X");
}

function findBestMove(player) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (let combo of winningCombinations) {
    const [a, b, c] = combo;
    if (board[a] === player && board[b] === player && !board[c]) return c;
    if (board[a] === player && board[c] === player && !board[b]) return b;
    if (board[b] === player && board[c] === player && !board[a]) return a;
  }
  return null;
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  return winningCombinations.some((combination) => {
    return combination.every((index) => board[index] === currentPlayer);
  });
}

function reset() {
  board = ["", "", "", "", "", "", "", "", ""];
  document.querySelectorAll(".cell").forEach((cell) => (cell.textContent = ""));
  document.getElementById("message").textContent = "";
  currentPlayer = "X";
  gameActive = true;
  localStorage.removeItem("gameState");
  saveGameState();
}

function renderBoard() {
  document.querySelectorAll(".cell").forEach((cell, index) => {
    cell.textContent = board[index];
  });
  document.getElementById("difficulty").value = difficulty;
}

function saveGameState() {
  const gameState = {
    board: board,
    currentPlayer: currentPlayer,
    gameActive: gameActive,
    difficulty: difficulty
  };
  localStorage.setItem("gameState", JSON.stringify(gameState));
}

function loadGameState() {
  const savedState = localStorage.getItem("gameState");
  if (savedState) {
    const gameState = JSON.parse(savedState);
    board = gameState.board;
    currentPlayer = gameState.currentPlayer;
    gameActive = gameState.gameActive;
    difficulty = gameState.difficulty;
  }
}
