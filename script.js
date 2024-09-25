let board = ["", "", "", "", "", "", "", "", ""];
let currentPlayer = "X";
let gameActive = true;

function makeMove(index) {
  if (!gameActive || board[index]) return;

  board[index] = currentPlayer;
  document.querySelectorAll(".cell")[index].textContent = currentPlayer;

  if (checkWinner()) {
    document.getElementById("message").textContent = `${currentPlayer} wins!`;
    gameActive = false;
  } else if (board.every((cell) => cell)) {
    document.getElementById("message").textContent = "It's a draw!";
    gameActive = false;
  } else {
    currentPlayer = currentPlayer === "X" ? "O" : "X";
  }
}

function checkWinner() {
  const winningCombinations = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6]
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
}
