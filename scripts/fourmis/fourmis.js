let cells;
let ants;

let rows;
let cols;
let resX;
let resY;

function setup() {

  createCanvas(800,800);
  frameRate(60);

  rows = 100;
  cols = 100;
  resX = width/cols;
  resY = height/rows;

  cells = initCells(rows,cols);
  ants = initAnts(75,rows/2,cols/2);
}


function draw() {
  background(0);
  noStroke();
  for (let x = 0; x < cols; x++)
  for (let y = 0; y < rows; y++) {
      fill(cells[x][y].food);
      rect(x*resX,y*resY,resX,resY);
  }

  strokeWeight(5);
  stroke(255,0,0);
  translate(resX/2, resY/2)
  for (let a of ants) {
    a.update(a);
    point(a.x*resX, a.y*resY);
  }

  decay(cells,0.99);

}
