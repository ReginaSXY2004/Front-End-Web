let colors = [];
let differentColorIndex;
let selectedSquare = null;
let remainingTime = 30;
let timerId;

function generateColors() {
  colors = [];
  const baseColor = getRandomColor();
  differentColorIndex = Math.floor(Math.random() * 10);
  
  for (let i = 0; i < 10; i++) {
    if (i === differentColorIndex) {
      colors.push(slightlyDifferentColor(baseColor));
    } else {
      colors.push(baseColor);
    }
  }
}

// Generate a random color
function getRandomColor() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  return `rgb(${r}, ${g}, ${b})`;
}

// One color is slightly different
function slightlyDifferentColor(color) {
  const colorMatch = color.match(/\d+/g); // Extract RGB values
  const r = parseInt(colorMatch[0]);
  const g = parseInt(colorMatch[1]);
  const b = parseInt(colorMatch[2]);
  
  const delta = 15;
  const adjust = (value) => Math.min(Math.max(value + (Math.random() * delta * 2 - delta), 0), 255);
  
  return `rgb(${adjust(r)}, ${adjust(g)}, ${adjust(b)})`;
}


function createGameBoard() {
  const gameBoard = document.getElementById('gameBoard');
  gameBoard.innerHTML = ''; 
  generateColors();
  colors.forEach((color, index) => {
    const square = document.createElement('div');
    square.classList.add('square');
    square.style.backgroundColor = color;
    square.onclick = () => selectSquare(index);
    gameBoard.appendChild(square);
  });
}

//square click
function selectSquare(index) {
  selectedSquare = index;
  if (selectedSquare === differentColorIndex) {
    document.getElementById('message').innerText = 'You found the different color!';
  } else {
    document.getElementById('message').innerText = 'Wrong! Try again!';
  }
}


function resetGame() {
  remainingTime = 30;
  document.getElementById('message').innerText = '';
  createGameBoard();
  startTimer();
}


function startTimer() {
  const timerElement = document.getElementById('timer');
  
  timerElement.innerText = `Time: ${remainingTime}s`;

  if (timerId) {
    clearInterval(timerId);
  }

  // Start the countdown
  timerId = setInterval(() => {
    if (remainingTime > 0) {
      remainingTime--;
      timerElement.innerText = `Time: ${remainingTime}s`;
    } else {
      clearInterval(timerId);
      document.getElementById('message').innerText = 'Time is up! Die!';
    }
  }, 1000); 
}


resetGame();
