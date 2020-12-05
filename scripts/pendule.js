


const w = 0.003;
let startAngle = 0.2*3.14;

let theta = startAngle;
let dtheta = 0;
let ddtheta = 0;

let theta2 = startAngle;
let dtheta2 = 0;
let ddtheta2 = 0;



function setup() {
  createCanvas(600,600);
}



function draw() {

  background(0);


  noStroke();
  textSize(32);
  textAlign(LEFT,TOP);

  fill(255);
  text("Simulation avec sin(x)",10,10);
  fill(255,0,0);
  text("Approximation \"sin(x)=x\"",10,40);

  update();
  update2();


  translate(width/2,height/2);

  fill(255);
  stroke(255);
  show(theta);

  fill(255,0,0,128);
  stroke(255,0,0);
  show(theta2);

}


function show(angle) {

  let x = (width/3 * sin(angle));
  let y = (width/3 * cos(angle));

  ellipse(x,y,50,50);
  line(0,0,x,y);
}

function update() {
  ddtheta = -sin(theta)*w;
  dtheta += ddtheta;
  theta  += dtheta;
}

function update2() {
  ddtheta2 = -theta2*w;
  dtheta2 += ddtheta2;
  theta2  += dtheta2;
}

function reset() {
  theta = startAngle;
  dtheta = 0;
  ddtheta = 0;

  theta2 = startAngle;
  dtheta2 = 0;
  ddtheta2 = 0;
}

function keyPressed() {
  reset();
}

function mousePressed() {
  startAngle = atan2(mouseX-width/2,mouseY-height/2);
  reset();
}
