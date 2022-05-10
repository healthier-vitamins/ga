import './style.css'

// initialize/declare variables needed.
const game = {
  squares: [],
  width: 10,
  //might change to starting position
  currentPosition: 4,
};

//tetrominos
const tetrominos = {
  lshape: [
    [1, game.width + 1, game.width * 2 + 1, game.width * 2 + 2],
    [game.width, game.width + 1, game.width + 2, game.width * 2],
    [0, 1, game.width + 1, game.width * 2 + 1],
    [2, game.width, game.width + 1, game.width + 2]
  ],
  oshape: [
    [1, 2, game.width + 1, game.width + 2],
    [1, 2, game.width + 1, game.width + 2],
    [1, 2, game.width + 1, game.width + 2],
    [1, 2, game.width + 1, game.width + 2]
  ],
  zshape: [
    [game.width + 1, game.width + 2, game.width * 2, game.width * 2 + 1],
    [0, game.width, game.width + 1, game.width],
    
],
  tshape: [],
  ishape: []
}

// draw main grid, 20x10.
const drawMainGrid = () => {
  for (let col = 0; col < 20; col++) {
    for (let row = 0; row < 10; row++) {
      const tempDiv = document.createElement("div");
      tempDiv.className = "grid";
      document.querySelector(".main-grid").append(tempDiv);
    }
  }
  game.squares = Array.from(document.querySelectorAll(".grid"));
}


document.addEventListener("DOMContentLoaded", () => {
  // draw main grid
  drawMainGrid();
  console.log(game)
  console.log(tetrominos.lshape)

  
  

  
})