


function setup() {

  createCanvas(600,600);
  frameRate(20);
  initCells(100,100);
}
//test



function draw() {
  background(0);
  displayCells();
  updateCells();
}