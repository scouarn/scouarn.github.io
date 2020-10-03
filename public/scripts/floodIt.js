let colors = 5;
let size = 10;
let res;

let cells;
let currentCol;
let lastColor;
let moves = 0;

const MENU = 0;
const GAME = 1;
const WIN = 2;

let state = MENU;


function setup() {

  createCanvas(600,600);
  noLoop();

}

function draw() {

  switch (state) {
    case GAME : displayGame(); break;
    case MENU : initGrid(); displayGame(); displayMenu(); break;
    case WIN  : displayGame(); displayMenu(); initGrid(); state = MENU; break;
  }


}

function keyPressed() {

  if (state == MENU) {
    switch (keyCode) {
      case LEFT_ARROW : size = max(size-1,2); break;
      case RIGHT_ARROW : size = min(size+1,100); break;
      case UP_ARROW : colors = min(colors+1,30); break;
      case DOWN_ARROW : colors = max(colors-1,2); break;
      case 32 : state = GAME; initGame(); break;
    }
    redraw();
  }
}

function mousePressed() {

  if (state == GAME) {

    let posX = floor(mouseX/res);
    let posY = floor(mouseY/res);

    if (posX < 0 || posY < 0 || posX >= size || posY >= size || cells[posY][posX] == currentCol)
      return;

    lastColor = currentCol;
    currentCol = cells[posY][posX];

    flood(0,0);
    moves ++;

    if (checkWin())
      state = WIN;

    redraw();


  }

}

function flood(x,y) {

  if (x < 0 || y < 0 || x >= size || y >= size || cells[y][x] != lastColor)
    return;

  cells[y][x] = currentCol;

  flood(x+1,y);
  flood(x-1,y);
  flood(x,y+1);
  flood(x,y-1);

}

function checkWin() {
  for (x = 0; x < size; x++)
    for (y = 0; y < size; y++)
      if (currentCol != cells[y][x])
        return false;

  return true;
}

function initGame() {

  moves = 0;
  currentCol = cells[0][0];

}

function initGrid() {

  colorMode(HSB,colors);

  cells = [];
  for (y = 0; y < size; y++) {
    let line = [];

    for (x = 0; x < size; x++)
      line.push(floor(random()*colors));

    cells.push(line);
  }

}


function displayGame() {

  background(255);
  noStroke();
  res = min(width/size,height/size);
  for (x = 0; x < size; x++)
    for (y = 0; y < size; y++) {
      fill(cells[y][x],128,128);
      rect(x*res,y*res,res,res);
  }

  fill(255);
  stroke(0);
  strokeWeight(3);
  textSize(32);
  textAlign(LEFT);
  text("moves : " + moves, 10,height-10);

}

function displayMenu() {
  fill(255);
  stroke(0);
  strokeWeight(3);
  textAlign(CENTER);

  textSize(64);
  text("FLOOD-IT!",width/2,height/2);

  textSize(32);
  text("press space to start",width/2,height/2 + 32);

  text("colors (↑↓) : " + colors,width/2,height-48);
  text("size  (⇄)  : " + size,width/2,height-10);

}
