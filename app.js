const URL = 'https://fe.it-academy.by/AjaxStringStorage2.php';
const PROJECT_NAME = 'SHVEIKUS_2048';

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

document.addEventListener('DOMContentLoaded', ()=>{
   
    const gridDisplay = document.querySelector('.grid');
    const scoreDisplay = document.getElementById('score');
    const resultDisplay = document.getElementById('result');
    const newGameButton = document.getElementById('new-game');

    const clickAudio=new Audio('moveCell2.mp3');
    clickSoundInit();

    function clickSoundInit() {
        clickAudio.play(); 
        clickAudio.pause(); 
    }

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
     
    //assign keycodes
    function control(e) {
        if(e.keyCode === 39) {
           keyRight();
        }  else if (e.keyCode === 37) {
            keyLeft(); 
        }  else if (e.keyCode === 38) {
            keyUp();
        }  else if (e.keyCode === 40) {
            keyDown();
        }
     }
    
    document.addEventListener('keyup', control);
    

    function keyRight() {
        moveRight();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function keyLeft() { 
        moveLeft();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function keyDown() { 
        moveDown();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }

    function keyUp() { 
        moveUp();
        generate();
        render();
        checkForWin();
        checkForGameOver();
    }


    // check for the number 2048 in the squares to win
    function checkForWin() {
        for (let r = 0; r < squares.length; r++) {
            for (let c = 0; c < squares[r].length; c++) {
                if (squares[r][c] === 2048) {
                    modal.style.display = "block";
                    result.innerHTML = 'You Win!';

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
            for (let c = 0; c < squares[r].length - 1; c++) {
                if (r !== squares.length - 1) {
                    if (squares[r][c] === squares[r + 1][c]) return;
                }

                if (squares[r][c] === squares[r][c + 1]) return;
            }
        }

        modal.style.display = "block";
        result.innerHTML = 'You Lose!';
 
        document.removeEventListener('keyup', control);
   }
   // work with the modal
        const modal = document.getElementById("resultModal");
        const span = document.getElementsByClassName("close")[0];
        const result = document.getElementById("infoWinOrLose");

 // When the user clicks on <span> (x), close the modal
        span.onclick = function() {
        modal.style.display = "none";
    }

 // When the user clicks anywhere outside of the modal, close it
        window.onclick = function(event) {
        if (event.target == modal) {
        modal.style.display = "none";
     }
 }

    newGameButton.addEventListener('click', startNewGame);
})

const fetchResults = async () => {
    const encodedBody = new URLSearchParams({
        f: 'LOCKGET',
        n: PROJECT_NAME,
        p: String(Math.random()),
    });

    const dataJSON = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: encodedBody,
    });

    const data = await dataJSON.json();

    return data;
}

const updateResults = async () => {
    const encodedBody = new URLSearchParams({
        f: 'UPDATE',
        n: PROJECT_NAME,
        v: JSON.stringify({
            name: 'dasha',
            score: '45',
        }),
        p: String(Math.random()),
    });

    const dataJSON = await fetch(URL, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
        },
        body: encodedBody,
    });

    const data = await dataJSON.json();

    console.log('data: ', data);

    return data;
}

// fetchResults();
updateResults();