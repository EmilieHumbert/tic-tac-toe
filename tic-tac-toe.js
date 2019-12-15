// Player factory
const Player = (name) => {
  const symbol = (Game.players.length > 0) ? 'o' : 'x';
  const score = 0;

  return { name, symbol, score };
};

// Gameboard
const Gameboard = (() => {
  const board = ['', '', '', '', '', '', '', '', ''];

  // render the contents of the gameboard array to the webpage
  const render = (boardEl) => {
    boardEl.innerHTML = '';
    board.forEach((value, index) => {
      // create a new div element, set class attribute and onclick
      let square = document.createElement('div');
      square.setAttribute('class', 'square');
      square.addEventListener('click', Game.selectSquare);
      square.dataset.index = index;
      // add the newly created element into the DOM 
      boardEl.appendChild(square);
    });
  };

  return {
    board,
    render
  };
})();

// Game object - controls flow
const Game = ((boardId) => {
  const players = [];
  const playersTurn = [];
  const boardEl = document.getElementById(boardId);

  const newPlayers = () => {
    // empty array
    players.length = 0;
    players.push(Player('Player X'));
    players.push(Player('Player O'));

    // assign default player positions
    playersTurn[0] = players[0];
    playersTurn[1] = players[1];
  };  

  const updatePlayers = () => {
    // modify the players name in players []
    players[0].name = document.getElementById('first-player-input').value;
    players[1].name = document.getElementById('second-player-input').value;

    // display new player names in DOM
    Display.updateNames();

    // close modal
    Display.closeModal();
  };

  const savePlayersButton = document.getElementById('add-names-btn');
  savePlayersButton.addEventListener('click', () => updatePlayers());

  const newBoard = () => {
    // empty squares
    Gameboard.board.forEach((square, index) => {
      Gameboard.board[index] = '';
    });
  
    Gameboard.render(boardEl);
  };
  
  // reset the game
  const reset = () => {
    newPlayers();
    newBoard();
    Display.updateNames();
    Display.updateScores();
    Display.resetFormNames();
  };

  // start a new match
  const next = () => {
    newBoard();
  };

  // define a win
  const isWinner = (symbol) => {
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
      return combination.every((index) => {
        return Gameboard.board[index] === symbol;
      });
    });
  };

  const isFull = () => {
    return Gameboard.board.every((square) => {
      return square !== '';
    });
  };

  // click on a specific square change it to the player's label
  const selectSquare = (event) => {
    const square = event.target;

    // check if square has content already
    if (Gameboard.board[square.dataset.index] !== '') {
      return;
    }

    const currentPlayer = playersTurn.shift();

    // add symbol to board array
    Gameboard.board[square.dataset.index] = currentPlayer.symbol;
    square.innerHTML = currentPlayer.symbol;

    // check for a winner
    if(isWinner(currentPlayer.symbol)) {
      alert(`${currentPlayer.name} wins!`);
      currentPlayer.score++;
      Display.updateScores();
      next();
    }

    if (isFull()) {
      alert('Draw!');
      next();
    }

    // next player
    playersTurn.push(currentPlayer);
  }

  return {
    reset,
    next,
    players,
    selectSquare
  };
})('board');

const Display = (() => {
  // modal
  // Get the modal
  const modal = document.getElementById('modal-player-name');

  const openModal = () => {
    modal.style.display = 'block';
  };
  // Get the button that opens the modal
  const openBtn = document.getElementById('name-btn');
  // When the user clicks the button, open the modal 
  openBtn.addEventListener('click', openModal);

  const closeModal = () => {
    modal.style.display = 'none';
    resetFormNames();
  };
  const cancelSpan = document.getElementsByClassName('modal-close')[0];
  cancelSpan.addEventListener('click', closeModal);
  const cancelBtn = document.getElementById('cancel-names-btn');
  cancelBtn.addEventListener('click', closeModal);
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = (event) => {
    if (event.target === modal) {
      closeModal();
    }
  };

  // reset button
  const resetButton = document.getElementById('reset-btn');
  resetButton.addEventListener('click', () => Game.reset());

  // update player names
  const updateNames = () => {
    document.getElementById('first-player-name').innerHTML = Game.players[0].name;
    document.getElementById('second-player-name').innerHTML = Game.players[1].name;    
  };

  // reset names on form
  const resetFormNames = () => {
    document.getElementById('first-player-input').value = Game.players[0].name;
    document.getElementById('second-player-input').value = Game.players[1].name;
  };

  // update player scores
  const updateScores = () => {
    document.getElementById('first-player-score').innerHTML = Game.players[0].score;
    document.getElementById('second-player-score').innerHTML = Game.players[1].score;  
  };

  return { 
    closeModal,
    updateNames,
    updateScores,
    resetFormNames
  };
})();

Game.reset();
