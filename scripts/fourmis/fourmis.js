let pheH;
let pheF;
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

  pheH = initCells(rows,cols);
  ants = initAnts(50,rows/2,cols/2);
}


function draw() {
  background(0);

  displayCells(pheH);


  stroke(255,0,0);
  strokeWeight(5);
  translate(resX/2, resY/2)
  for (let a of ants) {
    point(a.x*resX, a.y*resY);
    pheH[a.x][a.y] = 255;
    a = a.update(a);
  }
  pheH = decay(pheH,0.98);


}
