let currentGalaxy;
let currentSystem;
let playerShip;

let gameState;
let fpsBuffer = new Array(60);

let centerVec;

function setup() {
  createCanvas(window.innerWidth,window.innerHeight);
  gameState = new State_mainMenu();
  centerVec = createVector(width/2,height/2);

}

function draw() {
  fpsBuffer[frameCount%fpsBuffer.length] = frameRate();
  gameState.draw();
}


function mouseClicked(event) {
  gameState.mouseClicked(event);
  gameState.testButtons();

}

function keyPressed(event) {
  gameState.keyPressed(event);
}

function mouseWheel(event) {
  gameState.mouseWheel(event);
}

function showFPS() {

  let avg = 0;
  for (let i = 0; i < fpsBuffer.length; i++) avg += fpsBuffer[i];
  avg /= fpsBuffer.length;

  fill(255);
  noStroke();
  textSize(18);
  textAlign(RIGHT,BOTTOM);
  text("fps:"+avg.toFixed(1),width,height-35);
}
