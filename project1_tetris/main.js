/*
Thank you kubowania for the delightful guide.
https://www.youtube.com/watch?v=rAUn1Lom6dw&t=2356s
https://github.com/kubowania/Tetris-Basic 
*/

// initialize/declare variables needed.
const game = {
    squares: [],
    miniSquares: [],
    width: 10,
    miniWidth: 4,
    currentPosition: 3,
    currentRotation: 0,
    randomIndex: 0,
    nextRandomIndex: 0,
    timerId: null,
    score: 0,
    shapeColors: ['aquamarine', 'yellow', 'green', 'hotpink', 'orange'],
    isMiniGridFilled: false,
    currentTetromino: [],
    tetrominos: [],
    miniTetrominos: [],
    isGameOver: false,
  };
  
  game.tetrominos = [
    [
      //l tetromino
      [1, game.width + 1, game.width * 2 + 1, game.width * 2 + 2],
      [game.width, game.width + 1, game.width + 2, game.width * 2],
      [0, 1, game.width + 1, game.width * 2 + 1],
      [2, game.width, game.width + 1, game.width + 2],
    ],
      //o tetromino
    [
      [1, 2, game.width + 1, game.width + 2],
      [1, 2, game.width + 1, game.width + 2],
      [1, 2, game.width + 1, game.width + 2],
      [1, 2, game.width + 1, game.width + 2],
    ],
      //z tetromino
    [
      [1, 2, game.width, game.width + 1],
      [1, game.width + 1, game.width + 2, game.width * 2 + 2],
      [1, 2, game.width, game.width + 1],
      [1, game.width + 1, game.width + 2, game.width * 2 + 2],
    ],
      //t tetromino
    [
      [1, game.width + 1, game.width + 2, game.width * 2 + 1],
      [game.width, game.width + 1, game.width + 2, game.width * 2 + 1],
      [1, game.width, game.width + 1, game.width * 2 + 1],
      [1, game.width, game.width + 1, game.width + 2],
    ],
      //i tetromino
    [
      [2, game.width + 2, game.width * 2 + 2, game.width * 3 + 2],
      [game.width * 2, game.width * 2 + 1, game.width * 2 + 2, game.width * 2 + 3],
      [2, game.width + 2, game.width * 2 + 2, game.width * 3 + 2],
      [game.width * 2, game.width * 2 + 1, game.width * 2 + 2, game.width * 2 + 3],
    ]
  ]
  
  // mini tetrominos
  game.miniTetrominos = [
    //l tetromino
    [1, game.miniWidth + 1, game.miniWidth * 2 + 1, game.miniWidth * 2 + 2],
    //o tetromino
    [game.miniWidth + 1, game.miniWidth + 2, game.miniWidth * 2 + 1, game.miniWidth * 2 + 2],
    //z tetromino
    [1, game.miniWidth + 1, game.miniWidth + 2, game.miniWidth * 2 + 2],
    //t tetromino
    [1, game.miniWidth + 1, game.miniWidth + 2, game.miniWidth * 2 + 1],
    //i tetromino
    [1, game.miniWidth + 1, game.miniWidth * 2 + 1, game.miniWidth * 3 + 1]
  ]
  
  // draw main grid, 20x10.
  const drawMainGrid = () => {
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < game.width; col++) {
        const tempDiv = document.createElement("div");
        tempDiv.className = "grid";
        document.querySelector(".main-grid").append(tempDiv);
        // game.squares.push(0);
      }
    }
    const containerDiv = document.createElement("div");
    containerDiv.classList.add("container", "nes-container", "is-rounded");
    const maxContainer = document.createElement("div");
    maxContainer.classList.add("max-container");
    const mainGrid = document.querySelector(".main-grid");
    maxContainer.append(mainGrid);
    containerDiv.append(maxContainer);
    document.querySelector("body").append(containerDiv);
  
    drawTakenRow();
  }
  
  // draw mini grid, 4x4.
  const drawMiniGrid = () => {
    const miniContainer = document.createElement("div");
    miniContainer.classList.add("mini-container");
    const miniGrid = document.querySelector(".mini-grid")
    document.querySelector(".container").append(miniContainer);
    miniContainer.append(miniGrid);
  
    miniContainer.append(miniGrid);
    for (let col = 0; col < 4; col++) {
      for (let row = 0; row < 4; row++) {
        const tempDiv = document.createElement("div");
        tempDiv.className = "lesser-grid";
        miniGrid.append(tempDiv);
      }
    }
    game.miniSquares = document.querySelectorAll(".lesser-grid");
  
    //add score-display
    const scoreTitle = document.createElement("p");
    scoreTitle.classList.add("title");
    scoreTitle.innerHTML = "Score";
    const scoreDisplay = document.createElement("p");
    scoreDisplay.classList.add("score-display");
    scoreDisplay.innerHTML = 0;
    const scoreContainer = document.createElement("div")
    scoreContainer.classList.add("score-head", "nes-container", "with-title", "is-centered");
    miniContainer.append(scoreContainer);
    scoreContainer.append(scoreTitle);
    scoreTitle.append(scoreDisplay);
  
    //add startbutton
    const startBtnDiv = document.createElement("div");
    startBtnDiv.classList.add("startpause-button");
    const startBtn = document.createElement("button");
    startBtn.classList.add("start-pause", "nes-btn");
    startBtn.setAttribute("href", "#");
    startBtn.innerHTML = "Start/Pause";
    startBtnDiv.append(startBtn);
    miniContainer.append(startBtnDiv);
  }
  
  //draw final row of class "taken"
  const drawTakenRow = () => {
    for (let i = 0; i < 10; i++) {
      const tempDiv = document.createElement("div");
      tempDiv.classList.add("taken", "grid", "final");
      document.querySelector(".main-grid").append(tempDiv);
      // game.squares.push(1);
    }
    game.squares = Array.from(document.querySelectorAll(".grid"));
  }
  
  //clear mini grid for up next tetromino
  const clearMiniGrid = () => {
    game.miniSquares.forEach(square => {
      square.classList.remove("tetromino");
      square.style.removeProperty("background-color");
      game.isMiniGridFilled = false;
    })
  }
  //fill mini grid with next up tetromino
  const fillMiniGrid = () => { 
    clearMiniGrid();
    game.miniTetrominos[game.nextRandomIndex].forEach(index => { 
      game.miniSquares[index].classList.add("tetromino");
      game.miniSquares[index].style.backgroundColor = game.shapeColors[game.nextRandomIndex];
    })
    game.isMiniGridFilled = true;
  }
  
  //controlsss
  const control = (e) => {
    if (e.key === "ArrowLeft") {
      moveLeft();
    }
    else if (e.key === "ArrowRight") {
      moveRight();
    }
    else if (e.key === "ArrowUp") {
      rotate();
    }
    else if (e.key === "ArrowDown") {
      moveDown();
    }
    else if (e.key === " ") {
      instantDown();
    }
  }
  
  const draw = () => {
    for (let i = 0; i < game.currentTetromino.length; i++) {
      game.squares[game.currentPosition + game.currentTetromino[i]].classList.add("tetromino");
      game.squares[game.currentPosition + game.currentTetromino[i]].style.backgroundColor = game.shapeColors[game.randomIndex];
    }
  }
  
  const undraw = () => {
    for (let i = 0; i < game.currentTetromino.length; i++) {
      game.squares[game.currentPosition + game.currentTetromino[i]].classList.remove("tetromino");
      game.squares[game.currentPosition + game.currentTetromino[i]].style.removeProperty("background-color");
    }
  }
  
  const freeze = () => {
    if (game.currentTetromino.some(index => game.squares[index + game.currentPosition + game.width].classList.contains("taken"))) {
      //assign class "taken" for each block if next row consists of class "taken".
      game.currentTetromino.forEach(index => game.squares[index + game.currentPosition].classList.add("taken"))
        //draw new block at starting point.
      game.currentPosition = 3;
      game.currentRotation = 0;
      game.randomIndex = game.nextRandomIndex;
      game.nextRandomIndex = Math.floor(Math.random() * game.tetrominos.length);
      game.currentTetromino = game.tetrominos[game.randomIndex][game.currentRotation];
      fillMiniGrid();
      addScore();
      gameOver();
      draw();
    }
  }
  
  const moveDown = () => {
    undraw();
    //stupid bug. blocks on the same level with a left/right input will stack blocks.
    const bottomIsTaken = game.currentTetromino.some(index => game.squares[index + game.currentPosition + game.width].classList.contains("taken"));
    if (!bottomIsTaken) game.currentPosition += game.width;
    draw();
    freeze();
  }
  
  const moveLeft = () => {
    undraw();
    //if any block is located at left edge, return true to isAtLeftEdge.
    const isAtLeftEdge = game.currentTetromino.some(index => (index + game.currentPosition) % game.width === 0);
    //if false, move left once.
    if (!isAtLeftEdge) game.currentPosition -= 1;
    //if current square has a class "taken", reverse the increment. 
    if (game.currentTetromino.some(index => game.squares[index + game.currentPosition].classList.contains("taken")))
      game.currentPosition += 1;
    draw();
  }
  
  const moveRight = () => {
    undraw();
    const isAtRightEdge = game.currentTetromino.some(index => (game.currentPosition + index) % game.width === game.width - 1);
    if (!isAtRightEdge) game.currentPosition += 1;
    if (game.currentTetromino.some(index => game.squares[index + game.currentPosition].classList.contains("taken")))
      game.currentPosition -=1;
    draw();
  }
  
  const rotate = () => {
    undraw();
    if (canRotate()) 
      game.currentRotation++;
    if (game.currentRotation === game.tetrominos[game.randomIndex].length)
      game.currentRotation = 0;
    
    game.currentTetromino = game.tetrominos[game.randomIndex][game.currentRotation];
    amendRotation();
    draw();
  }
  
  const amendRotation = () => {
    let sameI = true;
    const iRotatedTetromino = [game.width * 2, game.width * 2 + 1, game.width * 2 + 2, game.width * 2 + 3]
    
    for (let i = 0; i < iRotatedTetromino.length; i++) {
      if (game.currentTetromino[i] !== iRotatedTetromino[i]) {
        sameI = false;
      }
    }
  
    if (sameI) {
      if (game.currentPosition % game.width === game.width -1) {
        if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === game.width -1)) {
          game.currentPosition += 1;
        }
      }
  
      else if ((game.currentPosition + 2) % game.width < 4) {
        if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === game.width -1)) {
            game.currentPosition += 2;
        }
      }
      else if (game.currentPosition % game.width > 5) {
        if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === 0)) {
          game.currentPosition -= 1;
        }
      }
    }
  
    else {
      if ((game.currentPosition + 1) % game.width < 4) {
        if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === game.width -1)) {
            game.currentPosition += 1;
        }
      }
      
      else if (game.currentPosition % game.width > 5) {
        if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === 0)) {
          game.currentPosition -= 1;
        }
      }
    }
  
    // P = P || game.currentPosition    //get current position.  Then, check if the piece is near the left side.
    // if ((P+1) % game.width < 4) {         //add 1 because the position index can be 1 less than where the piece is (with how they are indexed).     
    //   if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === game.width -1)) {            //use actual position to check if it's flipped over to right side
    //     game.currentPosition += 1    //if so, add one to wrap it back around
    //     amendRotation(P) //check again.  Pass position from start, since long block might need to move more.
    //     }
    // }
    // else if (P % game.width > 5) {
    //   if (game.currentTetromino.some(index => (game.currentPosition + index) % game.width === 0)) {
    //     game.currentPosition -= 1
    //     amendRotation(P)
    //   }
    // }
  }
  
  const canRotate = () => {
    let nextRotation = game.currentRotation + 1;
    if (nextRotation === game.tetrominos[game.randomIndex].length)
      nextRotation = 0;
  
    let rotatedTetromino = game.tetrominos[game.randomIndex][nextRotation];
    if (rotatedTetromino.some(index => game.squares[game.currentPosition + index].classList.contains("taken")))
      return false;
    
    return true;
  }
  
  const instantDown = () => {
    undraw();
    let hitLimit = false;
    let newWidth = 0;
    while (!hitLimit) {
      if (game.currentTetromino.some(index => game.squares[index + game.currentPosition + newWidth].classList.contains("taken"))) {
        game.currentPosition = game.currentPosition + (newWidth - game.width);
        hitLimit = true;
      }
      newWidth += game.width;
    }
    draw();
    freeze();
  }
  
  const addScore = () => {
    let multiplier = 0;
    //loops over every square, with an increment of 1 row
    //also initialize every row (allows iteration over it)
    for (let i = 0; i < game.squares.length - 10; i += game.width) {
      const row = [i, i+1, i+2, i+3, i+4, i+5, i+6, i+7, i+8,  i+9];
  
      //if condition of every element in a row has property of "taken"
      if (row.every(index => game.squares[index].classList.contains("taken"))) {
        multiplier++;
  
        //removes all classes within row
        row.forEach(index => {
          game.squares[index].classList.remove("taken", "tetromino");
          game.squares[index].style.removeProperty("background-color");
        })
  
        //update the array such that removed row(lowest), replaces very first row(highest)
        const removedSquares = game.squares.splice(i, game.width);
        game.squares = removedSquares.concat(game.squares);
        //then append updated array
        const mainGridDiv = document.querySelector(".main-grid");
        game.squares.forEach(cell => mainGridDiv.append(cell));
      }
    }
    if (multiplier > 1) {
      game.score = game.score + ((10 * multiplier) * multiplier);
    }
    else if (multiplier === 1) {
      game.score += 10;
    }
    document.querySelector(".score-display").innerHTML = game.score;
  }
  
  //start/pause button for either, new game, game over or pause/play
  const startPause = () => {
    if (!game.timerId) {
      if (game.isGameOver) {
        game.isGameOver = false;
        document.addEventListener("keyup", control);
        game.timerId = setInterval(moveDown, 1000);
        game.nextRandomIndex = Math.floor(Math.random() * game.tetrominos.length);
        game.currentTetromino = game.tetrominos[game.randomIndex][game.currentRotation];
        draw();
        fillMiniGrid();
      }
      else if (!game.isGameOver) {
        document.addEventListener("keyup", control);
        game.timerId = setInterval(moveDown, 1000);
        if (!game.isMiniGridFilled) {
          game.nextRandomIndex = Math.floor(Math.random() * game.tetrominos.length);
          game.currentTetromino = game.tetrominos[game.randomIndex][game.currentRotation]
          draw();
          fillMiniGrid();
        }
      }
    }
    else if (game.timerId) {
      clearInterval(game.timerId);
      game.timerId = null;
      document.removeEventListener("keyup", control);
    }
  }
  
  //game over condition
  const gameOver = () => {
    for (let i = 0; i < game.squares.length - 200; i++) {
      if (game.squares[i].classList.contains("taken") || game.currentTetromino.some(index => game.squares[index + game.currentPosition].classList.contains("taken"))) {
        alert("noob");
        clearInterval(game.timerId);
        game.timerId = null;
        document.removeEventListener("keyup", control);
        game.isGameOver = true;
  
        setTimeout(clearsAll, 1500);
        break;
      }
    }
    // if (game.currentTetromino.some(index => game.squares[index + game.currentPosition].classList.contains("taken"))) {
  }
  
  //resets entire screen (includes mini grid display)
  const clearsAll = () => {
    for (let i = 0; i < game.squares.length - 10; i++) {
      game.squares[i].classList.remove("tetromino", "taken");
      game.squares[i].style.removeProperty("background-color");
    }
    game.miniSquares.forEach(cell => {
      cell.classList.remove("tetromino", "taken");
      cell.style.removeProperty("background-color");
    })
    game.score = 0;
    document.querySelector(".score-display").innerHTML = game.score;
  }
  
  document.addEventListener("DOMContentLoaded", () => {
    drawMainGrid();
    drawMiniGrid();
    document.addEventListener("keydown", (event) => event.preventDefault());
    document.querySelector(".start-pause").addEventListener("click", startPause);
  })
  
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  /*
  
  Come back
  1. Change array of 210 to arrays of rows and cols. eg:
  squares = [[col, col, col][col, col, col]];
    ^ Note rotation for 2d array.
  
  2. Play around with CSS.
    ^ Dialogs, different game states with animation.
  
  3. Add history/leaderboard using cache?
  
  4. Add hold "arrowdown" key fit in tight slots.
  
  5. Add timer for each round.
  
  */
  //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////