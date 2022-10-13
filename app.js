const API_URL = 'https://shveikus-backend.herokuapp.com';

const colorsBack = {
    2: 'rgba(208, 253, 208, 0.09)',
    4: 'rgba(208, 253, 208, 0.18)',
    8: 'rgba(208, 253, 208, 0.27)',
    16: 'rgba(208, 253, 208, 0.36)',
    32: 'rgba(208, 253, 208, 0.45)',
    64: 'rgba(208, 253, 208, 0.54)',
    128: 'rgba(208, 253, 208, 0.63)',
    256: 'rgba(208, 253, 208, 0.72)',
    512: 'rgba(208, 253, 208, 0.81)',
    1024: 'rgba(208, 253, 208, 0.9)',
    2048: 'rgba(208, 253, 208, 0.99)'
}

const colors ={
    2: 'rgba(208, 253, 208, 0.99)',
    4: 'rgba(208, 253, 208, 0.9)',
    8: 'rgba(208, 253, 208, 0.81)',
    16: 'rgba(208, 253, 208, 0.72)',
    32: 'rgba(208, 253, 208, 0.63)',
    64: 'rgba(208, 253, 208, 0.54)',
    128: 'rgba(208, 253, 208, 0.45)',
    256: 'rgba(208, 253, 208, 0.36)',
    512: 'rgba(208, 253, 208, 0.27)',
    1024: 'rgba(208, 253, 208, 0.18)',
    2048: 'rgba(208, 253, 208, 0.09)'
}

function handleSwipes({ elem, onSwipeLeft, onSwipeRight, onSwipeUp, onSwipeDown }) {
    const SWIPE_GAP = 100;

    let isPointerDown = false;
    let pointerId;
    let startPositionX;
    let startPositionY;

    elem.addEventListener('pointerdown', (event) => {
        pointerId = event.pointerId;
        elem.setPointerCapture(event.pointerId);

        startPositionX = event.layerX;
        startPositionY = event.layerY;
        isPointerDown = true;
    });

    elem.addEventListener('pointermove', ({ layerX, layerY }) => {
        if (!isPointerDown) return;

        function endSwipe() {
            if (pointerId) {
                elem.releasePointerCapture(pointerId);
            }

            isPointerDown = false;
        }

        if (layerX - startPositionX > SWIPE_GAP) {
            onSwipeRight();
            endSwipe();
        }

        if (startPositionX - layerX > SWIPE_GAP) {
            onSwipeLeft();
            endSwipe();
        }

        if (layerY - startPositionY > SWIPE_GAP) {
            onSwipeDown();
            endSwipe();
        }

        if (startPositionY - layerY > SWIPE_GAP) {
            onSwipeUp();
            endSwipe();
        }
    });
}

async function postResult(name, score) {
    console.log(name,score);
    try {
        await fetch(API_URL + '/results', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name,
                score,
            }),
        });
    } catch (err) {
        console.error(err);
    }
}

async function getResults() {
    try {
        const response = await fetch(API_URL + '/results', {
            method: 'GET',
        });

        return response.json();
    } catch (err) {
        console.error(err);
    }
}

document.addEventListener('DOMContentLoaded', ()=>{
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const newGameButton = document.getElementById('new-game');
    const recordButton = document.getElementById('record');
    const saveResultButton =document.getElementById('saveResult');
    const recordsModal = document.getElementById('recordsModal');
    const recordsModalCloseButton = document.body.querySelector('#recordsModal .close');
    const resultModal = document.getElementById('resultModal');
    const gameScore = document.getElementById('gameScore');
    

    const clickAudio = new Audio('moveCell2.mp3');

    function clickSound() {
        clickAudio.currentTime=0; 
        clickAudio.play();
    }

    let squares = [
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0],
      [0, 0, 0, 0]
    ];
    let score = 0;

    function startNewGame() {
        score = 0;

        clearBoard();

        generate();
        generate();

        render();
    }

    startNewGame();

    function clearBoard() {
        gridDisplay.replaceChildren();
        squares = [
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0],
            [0, 0, 0, 0]
        ];
    }

    function render() {
        const squareDivs = [];

        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                const squareDiv = document.createElement('div');

                squareDiv.innerHTML = squares[r][c] || "";
                squareDiv.style.backgroundColor = colorsBack[squares[r][c]];
                squareDiv.style.color = colors[squares[r][c]];
                squareDivs.push(squareDiv);
            }
        }

        scoreDisplay.innerHTML = score;
        gridDisplay.replaceChildren(...squareDivs);
    }


    //generate random number
    function generate() {
        let randomNumberRow = Math.floor(Math.random() * squares.length);
        let randomNumberColumn = Math.floor(Math.random() * squares[randomNumberRow].length);

        if (squares[randomNumberRow][randomNumberColumn] === 0) {
            squares[randomNumberRow][randomNumberColumn] = Math.random() > 0.5 ? 2 : 4;
        } else if (!checkBoardFull()) {
            generate();
        }
    }

    function checkBoardFull() {
        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                if (squares[r][c] === 0) {
                    return false;
                }
            }
        }

        return true;
    }
    

    // move right
    function moveRight() {
        function moveAllZeroesLeft() {
            for (let r = 0; r < squares.length; r++) {
                for (let c = 0; c < squares[r].length - 1; c++) {
                    if (squares[r][c + 1] === 0) {
                        const buffer = squares[r][c + 1];

                        squares[r][c + 1] = squares[r][c];
                        squares[r][c] = buffer;
                    }
                }
            }
        }

        for (let r = 0; r < squares.length; r++) {
            moveAllZeroesLeft();

            for (let c = 0; c < squares[r].length - 1; ) {
                let leftNumber = squares[r][c];
                let rightNumber = squares[r][c + 1];

                if (leftNumber === 0 || rightNumber === 0) {
                    c++;
                } else if (leftNumber === rightNumber) {
                    const sum = leftNumber + rightNumber;

                    squares[r][c + 1] = sum;
                    squares[r][c] = 0;
                    score += sum;

                    c += 2;
                    clickSound();
                } else {
                    c++;
                }
            }

            moveAllZeroesLeft();
        }
    }

    // move left
    function moveLeft() {
        function moveAllZeroesRight() {
            for (let r = 0; r < squares.length; r++) {
                for (let c = 0; c < squares[r].length - 1; c++) {
                    if (squares[r][c] === 0) {
                        const buffer = squares[r][c];

                        squares[r][c] = squares[r][c + 1];
                        squares[r][c + 1] = buffer;
                    }
                }
            }
        }

        for (let r = 0; r < squares.length; r++) {
            moveAllZeroesRight();

            for (let c = 0; c < squares[r].length; ) {
                let leftNumber = squares[r][c];
                let rightNumber = squares[r][c + 1];

                if (leftNumber === 0 || rightNumber === 0) {
                    c++;
                } else if (leftNumber === rightNumber) {
                    const sum = leftNumber + rightNumber;

                    squares[r][c] = sum;
                    squares[r][c + 1] = 0;
                    score += sum;

                    c += 2;

                    clickSound();
                } else {
                    c++;
                }
            }

            moveAllZeroesRight();
        }
    }

    //move down
    function moveDown() {
        function moveAllZeroesUp() {
            for (let c = 0; c < squares.length; c++) {
                for (let r = 0; r < squares[c].length - 1; r++) {
                    if (squares[r + 1][c] === 0) {
                        const buffer = squares[r + 1][c];

                        squares[r + 1][c] = squares[r][c];
                        squares[r][c] = buffer;
                    }
                }
            }
        }

        for (let c = 0; c < squares.length; c++) {
            moveAllZeroesUp();

            for (let r = 0; r < squares[c].length - 1; ) {
                let upperNumber = squares[r][c];
                let lowerNumber = squares[r + 1][c];

                if (upperNumber === 0 || lowerNumber === 0) {
                    r++;
                } else if (upperNumber === lowerNumber) {
                    const sum = upperNumber + lowerNumber;

                    squares[r + 1][c] = sum;
                    squares[r][c] = 0;
                    score += sum;

                    r += 2;

                    clickSound();
                } else {
                    r++;
                }
            }

            moveAllZeroesUp();
        }
    }

    //move up
    function moveUp() {
        function moveAllZeroesDown() {
            for (let c = 0; c < squares.length; c++) {
                for (let r = 0; r < squares[c].length - 1; r++) {
                    if (squares[r][c] === 0) {
                        const buffer = squares[r][c];

                        squares[r][c] = squares[r + 1][c];
                        squares[r + 1][c] = buffer;
                    }
                }
            }
        }

        for (let c = 0; c < squares.length; c++) {
            moveAllZeroesDown();

            for (let r = 0; r < squares[c].length - 1; ) {
                let upperNumber = squares[r][c];
                let lowerNumber = squares[r + 1][c];

                if (upperNumber === 0 || lowerNumber === 0) {
                    r++;
                } else if (upperNumber === lowerNumber) {
                    const sum = upperNumber + lowerNumber;

                    squares[r][c] = sum;
                    squares[r + 1][c] = 0;
                    score += sum;

                    r += 2;

                    clickSound();
                } else {
                    r++;
                }
            }

            moveAllZeroesDown();
        }
    }

    function handleMoveRight() {
        moveRight();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function handleMoveLeft() {
        moveLeft();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function handleMoveDown() {
        moveDown();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function handleMoveUp() {
        moveUp();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }
     
    //assign keycodes
    function control(e) {
        if(e.keyCode === 39) {
            handleMoveRight();
        }  else if (e.keyCode === 37) {
            handleMoveLeft();
        }  else if (e.keyCode === 38) {
            handleMoveUp();
        }  else if (e.keyCode === 40) {
            handleMoveDown();
        }
     }
    
    document.addEventListener('keyup', control);

    // check for the number 2048 in the squares to win
    function checkForWin() {
        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                if (squares[r][c] === 2048) {
                    modalResult.style.display = "block";
                    result.innerHTML = 'You Win!';
                    gameScore.innerHTML = score;

                    document.removeEventListener('keyup', control);
                }
            }
        }
   }

    function checkForGameOver() {
        if (!checkBoardFull()) {
            return;
        }

        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                if (r !== squares.length - 1) {
                    if (squares[r][c] === squares[r + 1][c]) return;
                }

                if (c !== squares[r].length - 1) {
                    if (squares[r][c] === squares[r][c + 1]) return;
                }
            }
        }

        modalResult.style.display = "block";
        result.innerHTML = 'You Lose!';
        gameScore.innerHTML = 'Ваш счет: ' + score;

 
        
    }
    
    saveResultButton.addEventListener('click', handleSubmit);

    function handleSubmit() {
        let name = document.getElementById('name').value;
        postResult(name, score);
    }

   // work with the modal
    const modalResult = document.getElementById("resultModal");
    const span = document.getElementsByClassName("close")[0];
    const result = document.getElementById("infoWinOrLose");

    // When the user clicks on <span> (x), close the modal
    span.onclick = function() {
        modalResult.style.display = "none";
    }

    // When the user clicks anywhere outside of the modal, close it
    window.onclick = function(event) {
        if (event.target === modalResult || event.target ===  recordsModal) {
            modalResult.style.display = "none";
            recordsModal.style.display = "none";
            
        }
    }

    async function viewRecords() {
        const results = await getResults();
        const recordsTable = document.getElementById('recordsTable');

        const resultElements = results.slice(0, 6).map(({ name, score }, idx) => {
            const li = document.createElement('li');

            li.className = `top${idx}`;
            li.innerHTML = `${name}: ${score}`;

            return li;
        });

        recordsTable.replaceChildren(...resultElements);
        recordsModal.style.display = "block";

    }

    newGameButton.addEventListener('click', startNewGame);
    recordButton.addEventListener('click', viewRecords);
    recordsModalCloseButton.addEventListener('click', () => {
        recordsModal.style.display = "none";
    })

    window.onbeforeunload = function() {
        return "Прогресс игры не сохранится, точно хотите обновить страницу?";
      };

    handleSwipes({
        elem: gridDisplay,
        onSwipeLeft: handleMoveLeft,
        onSwipeRight: handleMoveRight,
        onSwipeUp: handleMoveUp,
        onSwipeDown: handleMoveDown,
    });
})
