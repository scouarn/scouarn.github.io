let cells;
let ants;

let rows;
let cols;
let resX;
let resY;

function setup() {

  createCanvas(600,600);
  frameRate(60);

  rows = 100;
  cols = 100;
  resX = width/cols;
  resY = height/rows;

  cells = initCells(rows,cols);
  ants = initAnts(50,rows/2,cols/2);
}


function draw() {
  background(0);

  displayCells(cells);

  strokeWeight(5);
  translate(resX/2, resY/2)
  for (let a of ants) {
    a.update(a);
  }

  decay(cells,0.99);

}
