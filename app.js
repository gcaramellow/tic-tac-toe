const uiController = (function () {

  return {
    setupBoard: function(p1, p2) {
      if (p1 === '') {
        p1 = 'Player';
      }
      if (p2 === '') {
        p2 = 'Player';
      }
      document.getElementById('player-1-name').textContent = p1;
      document.getElementById('player-2-name').textContent = p2;
      document.getElementById('newGameBtn').style.display = 'none';
    },
    setSquare: function(marker, el) {
      if (marker == 'x') {
        el.innerHTML = marker;
      } else {
        el.innerHTML = marker;
      }
    },
    showPlayerTurn: function(turn) {
      if (turn) {
        // Show that it's x's turn
        document.getElementById('turn-marker').classList.remove('turn-marker-o-class');
        document.getElementById('turn-marker').classList.add('turn-marker-x-class');
        
        // document.getElementById('turn-marker-x').classList.add('turn-marker-x-class');
        // document.getElementById('turn-marker-o').classList.remove('turn-marker-o-class');
      } else {
        // Show that it's o's turn
        document.getElementById('turn-marker').classList.remove('turn-marker-x-class');
        document.getElementById('turn-marker').classList.add('turn-marker-o-class');
        
        // document.getElementById('turn-marker-o').classList.add('turn-marker-o-class');
        // document.getElementById('turn-marker-x').classList.remove('turn-marker-x-class');
      }
    },
    winningModal: function(winner, obj) {
      console.log('The winner is ' + winner);
      if (winner == 'x') {
        document.getElementById('winner-name').textContent = obj.name;
        document.getElementById('winner-marker').classList.add('x');
        document.getElementById('winning-message').textContent = 'Wins!';
      } else if (winner == 'o') {
        document.getElementById('winner-name').textContent = obj.name;
        document.getElementById('winner-marker').classList.add('o-modal');
        document.getElementById('winning-message').textContent = 'Wins!';
      } else {
        document.getElementById('winning-message').textContent = 'Draw!';
      }
      $('#winningModal').modal('show');
    },
    clearWinningModal: function () {
      document.getElementById('winner-marker').classList.remove('x');
      document.getElementById('winner-marker').classList.remove('o-modal');
      document.getElementById('winning-message').textContent = '';
      document.getElementById('winner-name').textContent = '';

    }
  }

})();

const gameController = (function (uiCtrl) {

  let playerTurn, xHTML, oHTML, gameOn, playerArray;

  xHTML = '<div class="x">';
  oHTML = '<div class="o">';

  const Player = function (name) {
      this.name = name;
  }

  const setEventListeners = function () {
    
    // event listener for getting names
    document.getElementById('get-names').addEventListener('click', initGame);
    document.getElementById('new-players').addEventListener('click', function () {
      uiCtrl.clearWinningModal();
      $('#winningModal').modal('hide');
      $('#newGameModal').modal('show');
    });
    document.getElementById('restart').addEventListener('click', restartGame);


  }
  const initBoard = function() {
    for (let i = 0; i < 9; i++) {
      document.querySelector('.square-' + i).innerHTML = '';
    }
    uiCtrl.clearWinningModal();
  }
  const setPlayerStartTurn = function() {
    let turn = Math.floor(Math.random() * 2);
    console.log(turn);
    if (turn === 0) {
      // o goes first
      return false;
    } else {
      // x goes first
      return true;
    }
  }
  const placeMarker = function(element) {
    if ((element.classList.contains('square')) && (!element.hasChildNodes())) {
      if (playerTurn && gameOn) {
        uiCtrl.setSquare(xHTML, element);
        checkForWin(readBoard());
        if (gameOn) {
          playerTurn = !playerTurn;
          uiCtrl.showPlayerTurn(playerTurn);
        }
        
      } else if (!playerTurn && gameOn) {
        uiCtrl.setSquare(oHTML, element);
        checkForWin(readBoard());
        if (gameOn) {
          playerTurn = !playerTurn;
          uiCtrl.showPlayerTurn(playerTurn);
        }
        
      }
    }
  }
  const setPlayers = function () {
    let playerArr;
    let playerName1 = document.getElementById('player-1').value;
    let playerName2 = document.getElementById('player-2').value;
    player1 = new Player(playerName1);
    player2 = new Player(playerName2);
    return playerArr = [player1, player2];
  }

  const initGame = function () {
    
    console.log('The game is on.');
    initBoard();
    playerArray = setPlayers();
    playerTurn = setPlayerStartTurn();

    uiCtrl.showPlayerTurn(playerTurn);

    gameOn = true;

    uiCtrl.setupBoard(playerArray[0].name, playerArray[1].name);

    for (let i = 0; i < 9; i++) {
      document.querySelector('.square-' + i).addEventListener('click', function (e) {
        placeMarker(e.target);
      });
    }
  }
  const restartGame = function () {
    initBoard();
    playerTurn = setPlayerStartTurn();
    uiCtrl.showPlayerTurn(playerTurn);
    gameOn = true;
    $('#winningModal').modal('hide');
    uiCtrl.clearWinningModal();
  }
  const readBoard = function() {
    let boardList = document.getElementsByClassName('square');
    let boardArray = [];
    
    for (let i = 0; i < boardList.length; i++) {
      if (boardList[i].hasChildNodes()) {
        if (boardList[i].innerHTML.search('x') > 0) {
          boardArray[i] = 'x';
        } else {
          boardArray[i] = 'o';
        }
      } 
    }
    return boardArray;
  }
  const checkForWin = function (board) {
    let gameWon = false;
    if         ((board[0] == 'x' && board[3] == 'x' && board[6] == 'x') ||
               (board[6] == 'x' && board[7] == 'x' && board[8] == 'x') ||
               (board[2] == 'x' && board[5] == 'x' && board[8] == 'x') ||
               (board[0] == 'x' && board[2] == 'x' && board[1] == 'x') ||
               (board[0] == 'x' && board[4] == 'x' && board[8] == 'x') ||
               (board[2] == 'x' && board[4] == 'x' && board[6] == 'x') ||
               (board[1] == 'x' && board[4] == 'x' && board[7] == 'x') ||
               (board[3] == 'x' && board[4] == 'x' && board[5] == 'x')) {
                gameWon = true;
                winningSequence('x', playerArray[0]);          
    } else if ((board[0] == 'o' && board[3] == 'o' && board[6] == 'o') ||
               (board[6] == 'o' && board[7] == 'o' && board[8] == 'o') ||
               (board[2] == 'o' && board[5] == 'o' && board[8] == 'o') ||
               (board[0] == 'o' && board[2] == 'o' && board[1] == 'o') ||
               (board[0] == 'o' && board[4] == 'o' && board[8] == 'o') ||
               (board[2] == 'o' && board[4] == 'o' && board[6] == 'o') ||
               (board[1] == 'o' && board[4] == 'o' && board[7] == 'o') ||
               (board[3] == 'o' && board[4] == 'o' && board[5] == 'o')) {
                gameWon = true;
                winningSequence('o', playerArray[1]);
    } else if (board[0] && 
               board[1] && 
               board[2] &&
               board[3] && 
               board[4] &&
               board[5] && 
               board[6] &&
               board[7] && 
               board[8] &&
               (gameWon == false)) {
                winningSequence('draw');
    }
  }
  const winningSequence = function (winner, playerObj) {
    uiCtrl.winningModal(winner, playerObj);
    gameOn = false;
  }

  return {
      init: function () {
        console.log('The program is on.');
        setEventListeners();
      }
  }

})(uiController)

gameController.init();