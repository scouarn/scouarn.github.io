let cells;


function setup() {

  createCanvas(600,600);
  frameRate(20);
  cells = initCells(100,100);
}


function draw() {
  background(0);
  displayCells(cells);
  updateCells(cells);
}
