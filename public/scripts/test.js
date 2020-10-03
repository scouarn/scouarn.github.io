
function setup() {

  createCanvas(600, 600);
  background(0);
}

function draw() {
  stroke(random(255),random(255),random(255));
  line(random(width),random(height),random(width),random(height));
}

function mousePressed() {
  background(0);
}
