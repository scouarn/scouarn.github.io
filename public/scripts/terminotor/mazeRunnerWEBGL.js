

let mazeWidth = 5;
let mazeHeight= 5;
let noiseFactor = 0.8;

//map attributes
let map;
let mapW, mapH;
let tileW;

//player attributes
let pX, pY, pZ;
let pVX, pVZ;
let pAcc, friction;
let vX; let vY; let vZ;
let horizontalAngle; let verticalAngle;
let blockWidth;

let showMap = false;

function setup() {
  createCanvas(600,600,WEBGL);
  perspective(PI / 3.0, width/height, 0.01, 1000);
  initGame();
}

function draw() {
  updatePlayer();
  checkWin();

  background(175);
  strokeWeight(2);

  camera(pX*blockWidth,pY*blockWidth,pZ*blockWidth,blockWidth*(pX+vX),blockWidth*(pY+vY),blockWidth*(pZ+vZ),0,-1,0);

  renderMaze();




}

function keyPressed() {
  if (key == "m")
    showMap = !showMap;
}

function mouseClicked() {
  requestPointerLock();
}

function dispCell(x,y,z) {
  push();
  translate(x*blockWidth,y*blockWidth,z*blockWidth);
  box(blockWidth);
  pop();
}

function renderMaze() {

  stroke(0);
  translate(blockWidth/2,0,blockWidth/2);
  for (x = 0; x < mapW; x++)
    for (y = 0; y < mapH; y++)
      switch (getTile(x,y)) {
        case 1: fill(255); dispCell(x,0,y); break;
        case 2: fill(0,255,0); dispCell(x,0,y); break;
        default: break;

      }

}


function checkWin() {
  if (getTile(pX,pZ) == 2)
    initGame();
}




function initGame() {

  let maze = generateMaze(mazeWidth,mazeHeight,noiseFactor);
  map = rasterizeMaze(maze);
  mapW = map[0].length, mapH = map.length;
  map[mapH-1][mapW-2] = 2;

  tileW = min(width/mapW,height/mapW);

  pX = 1.5, pY = 0; pZ = 1.5;
  pVX = 0, pVZ = 0;
  pAcc = 0.008, friction = 0.95;

  if (getTile(2,1) == 1)
    horizontalAngle = PI/2;
  else
    horizontalAngle = 0;

  verticalAngle = 0;
  blockWidth = 64;

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

  verticalAngle = constrain(verticalAngle,-1.5,1.5);

  VX0 = Math.cos(horizontalAngle);
  VZ0 = Math.sin(horizontalAngle);

  vX = VX0 * Math.cos(verticalAngle);
  vZ = VZ0 * Math.cos(verticalAngle);
  vY = Math.sin(verticalAngle);

  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));
  const InvSqrt2 = 1/sqrt(2);

  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: pVX += VX0*pAcc; pVZ += VZ0*pAcc; break;
    case 0b0100: pVX -= VZ0*pAcc; pVZ += VX0*pAcc; break;
    case 0b0010: pVX -= VX0*pAcc; pVZ -= VZ0*pAcc; break;
    case 0b0001: pVX += VZ0*pAcc; pVZ -= VX0*pAcc; break;
    case 0b1100: pVX += pAcc*(VX0-VZ0)*InvSqrt2;  pVZ += pAcc*(VZ0+VX0)*InvSqrt2;  break;
    case 0b1001: pVX += pAcc*(VX0+VZ0)*InvSqrt2;  pVZ += pAcc*(VZ0-VX0)*InvSqrt2;  break;
    case 0b0110: pVX += pAcc*(-VX0-VZ0)*InvSqrt2; pVZ += pAcc*(-VZ0+VX0)*InvSqrt2; break;
    case 0b0011: pVX += pAcc*(-VX0+VZ0)*InvSqrt2; pVZ += pAcc*(-VZ0-VX0)*InvSqrt2; break;
  }

  pVX *= friction, pVZ *= friction;

  if (getTile(pX+pVX,pZ) == 1)
    pVX = 0;
  if (getTile(pX,pZ+pVZ) == 1)
    pVZ = 0;

  pX += pVX, pZ += pVZ;



}


function vecLength(x,y) {
  return sqrt(x*x + y*y);
}

function getTile(x,y) {
  if (outOfBounds(x,y))
    return 0;
  else
    return map[floor(y)][floor(x)];
}

function dRound(x) {
  return floor(x*10)/10
}

function outOfBounds(x,y) {
  if (x < 0)
    return true;
  else if (y < 0)
    return true;
  else if (x >= mapW)
    return true;
  else if (y >= mapH)
    return true;
  else
    return false;
}


let temp_maze;
let temp_visited;
function generateMaze(sizeX,sizeY,noise) {
  temp_maze = array2DInit(sizeX,sizeY,0);
  temp_visited = array2DInit(sizeX,sizeY,0);

  let maze = recursiveBacktracker(0,0);
  maze = addNoise(maze,noise);

  return maze;
}

function recursiveBacktracker(x,y) {

  //Mark the current cell as visited
  temp_visited[y][x] = 1;


  let neighboursVisit = getNeighbours(x,y,temp_visited);

  //While the current cell has any unvisited neighbour cells
  while (neighboursVisit.includes(0)) {

    //Chose one of the unvisited neighbours
    let cell = getIndexRandomFromValue(neighboursVisit,0);


    //Remove the wall between the current cell and the chosen cell
    switch (cell) {

      case 0: temp_maze[y][x] |= 0b1000; temp_maze[y-1][x] |= 0b0010; recursiveBacktracker(x,y-1); break;
      case 1: temp_maze[y][x] |= 0b0100; temp_maze[y][x+1] |= 0b0001; recursiveBacktracker(x+1,y); break;
      case 2: temp_maze[y][x] |= 0b0010; temp_maze[y+1][x] |= 0b1000; recursiveBacktracker(x,y+1); break;
      case 3: temp_maze[y][x] |= 0b0001; temp_maze[y][x-1] |= 0b0100; recursiveBacktracker(x-1,y); break;

    }
    neighboursVisit = getNeighbours(x,y,temp_visited);
  }

  return temp_maze;
}

function addNoise(mz,noise) {
  let sizeX=mz[0].length;
  let sizeY=mz.length;

  for (let x=0; x<sizeX; x++) {
    for (let y = 0; y<sizeY; y++) {

      if ([1,2,4,8].includes(mz[y][x]) && random()<noise) { //dead ends
        let side = floor(random(4));

        switch (side) {
          case 0: if (y<=1){break;}        mz[y][x] |= 0b1000; break;
          case 1: if (x>=sizeX-1){break;}  mz[y][x] |= 0b0100; break;
          case 2: if (y>=sizeY-1){break;}  mz[y][x] |= 0b0010; break;
          case 3: if (x<=1){break;}        mz[y][x] |= 0b0001; break;

        }




      }
    }

  }

  return mz;
}

function getIndexRandomFromValue(arr,val) {

  let i = floor(random(arr.length));
  if (arr[i] == val) {
    return i;
  }
  else {
    return getIndexRandomFromValue(arr,val);
  }
}

function getNeighbours(x,y,arr) {
  let neighbours = [1,1,1,1]; //default true to deal with edges in backtracker function

  if (y>=1)
    neighbours[0] = arr[y-1][x];

  if (x<arr[0].length-1)
    neighbours[1] = arr[y][x+1];

  if (y<arr.length-1)
    neighbours[2] = arr[y+1][x];

  if (x>=1)
    neighbours[3] = arr[y][x-1];

  return neighbours;
}


function rasterizeMaze(mz) {
  let sizeX = mz[0].length;
  let sizeY = mz.length;

  let mp = array2DInit(2*sizeX+1,2*sizeY+1,1);


  for (let x=0; x<sizeX; x++) {
    for (let y=0; y<sizeY; y++) {

      let walls = mz[y][x];
      let mpX = 2*x+1;
      let mpY = 2*y+1

      mp[mpY][mpX] = 0;   //CELL

      if ((walls & 8) != 0)  //HAUT
        mp[mpY-1][mpX] = 0;

      if ((walls & 4) != 0)  //DROITE
        mp[mpY][mpX+1] = 0;

      if ((walls & 2) != 0)  //BAS
        mp[mpY+1][mpX] = 0;

      if ((walls & 1) != 0)  //GAUCHE
        mp[mpY][mpX-1] = 0;


    }
  }

  return mp;
}


function array2D(cols,rows) {

  let arr = new Array(rows);
  for (let i = 0; i<rows; i++)
    arr[i] = new Array(cols);

  return arr;

}

function array2DInit(cols,rows,value) {

  let arr = array2D(cols,rows)

  for (let x = 0; x<cols; x++)
    for (let y = 0; y<rows; y++)
      arr[y][x] = value;

  return arr;

}
