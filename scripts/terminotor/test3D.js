let pX = 0; let pVX = 0;
let pY = 0; let pVY = 0;
let pZ = 0; let pVZ = 0;

let vX; let vY; let vZ;
let horizontalAngle = 0; let verticalAngle = 0;

const friction = 0.95;
const pAcc = 0.008;
const turnRate = 0.06;
const blockWidth = 64;


function setup() {
  createCanvas(600, 600, WEBGL);
  perspective(PI / 3.0, width/height, 0.1, 1000);

}

function draw(){
  updatePlayer();
  background(175);
  strokeWeight(2);

  camera(pX*blockWidth,pY*blockWidth,pZ*blockWidth,blockWidth*(pX+vX),blockWidth*(pY+vY),blockWidth*(pZ+vZ),0,-1,0);

  showOrigin();


  dispCell(-2,3);
  dispCell(0,2);
  dispCell(2,1);
  dispCell(4,0);


}

function mouseClicked() {
  requestPointerLock();
}

function dispCell(x,z) {
  push();
  stroke(0);
  fill(255);
  translate(x*blockWidth,0,z*blockWidth);
  box(blockWidth);
  pop();
}

function showOrigin() {
  stroke(255,0,0);  //X
  line(0,0,0,blockWidth,0,0);
  stroke(0,255,0); //Y
  line(0,0,0,0,blockWidth,0);
  stroke(0,0,255); //Z
  line(0,0,0,0,0,blockWidth);
}


function updatePlayer() {

  if (keyIsDown(32) ) {
    pY += pAcc*5;
  }
  else if (keyIsDown(16)) {
    pY -= pAcc*5;
  }

  horizontalAngle -= atan(movedX/width);
  verticalAngle -= atan(movedY/height);

  vX = Math.cos(horizontalAngle) * Math.cos(verticalAngle);
  vZ = Math.sin(horizontalAngle) * Math.cos(verticalAngle);
  vY = Math.sin(verticalAngle);



  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));
  const InvSqrt2 = 1/sqrt(2);

  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: pVX += vX*pAcc; pVZ += vZ*pAcc; break;
    case 0b0100: pVX -= vZ*pAcc; pVZ += vX*pAcc; break;
    case 0b0010: pVX -= vX*pAcc; pVZ -= vZ*pAcc; break;
    case 0b0001: pVX += vZ*pAcc; pVZ -= vX*pAcc; break;
    case 0b1100: pVX += pAcc*(vX-vZ)*InvSqrt2;  pVZ += pAcc*(vZ+vX)*InvSqrt2;  break;
    case 0b1001: pVX += pAcc*(vX+vZ)*InvSqrt2;  pVZ += pAcc*(vZ-vX)*InvSqrt2;  break;
    case 0b0110: pVX += pAcc*(-vX-vZ)*InvSqrt2; pVZ += pAcc*(-vZ+vX)*InvSqrt2; break;
    case 0b0011: pVX += pAcc*(-vX+vZ)*InvSqrt2; pVZ += pAcc*(-vZ-vX)*InvSqrt2; break;
  }

  pVX *= friction, pVZ *= friction;

  pX += pVX, pZ += pVZ;



}
