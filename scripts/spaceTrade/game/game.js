let currentGalaxy;
let currentSystem;
let playerShip;

let gameState;
let fpsBuffer = new Array(60);


function setup() {
  let cvs = createCanvas(window.innerWidth,window.innerHeight);
  //cvs.position(0,0);

  gameState = new State_mainMenu();

  currentGalaxy = new Galaxy();

  currentSystem = new DummySystem(0,currentGalaxy.coords[0]).promote();
  let sun = new Planet(mass = 1000, radius = 1000, name = "Sun");
  let earth = new Planet(mass = 250, radius = 250, name = "Earth");
  let moon = new Planet(mass = 50, radius = 50, name="Moon");
  currentSystem.appendPlanet(sun);
  currentSystem.appendPlanet(earth, parent = sun,1000000);
  currentSystem.appendPlanet(moon, parent = earth, 500);

  playerShip = new Ship();
  currentSystem.appendChild(playerShip);
  playerShip.setOrbit(earth, 100);
  playerShip.autopilot.setTarget(moon);


}

function draw() {
  fpsBuffer[frameCount%fpsBuffer.length] = frameRate();
  gameState.draw();
}


function mouseClicked() {
  gameState.mouseClicked();
  gameState.testButtons();

}

function keyPressed() {
  gameState.keyPressed();
}
