let mazeWidth = 5;
let mazeHeight= 5;
let noiseFactor = 0.8;

let map;
let mapW, mapH;
let blockW, blockH;
let pX, pY;
let pVX, pVY;
let pAcc, friction;
let pA;


function setup() {

  createCanvas(600,600);
  init();


}

function draw() {

  render2D();
  updatePlayer();
  checkWin();

}


function render2D() {
  background(0);

  noStroke();

  //scene
  for (x = 0; x < mapW; x++)
    for (y = 0; y < mapH; y++) {
      switch (map[y][x]) {
        case "#": fill(0); break;
        case " ": fill(255); break;
        case "!": fill(50,255,50); break;
        default: fill(255,0,0); break;

      }
      rect(x*blockW,y*blockW,blockW,blockW);
    }

  //player
  let pX_screen = pX*blockW;
  let pY_screen = pY*blockW;

  fill(0,255,0);
  ellipse(pX_screen,pY_screen,blockW*0.5,blockW*0.5);
  stroke(255,0,0);
  line(pX_screen,pY_screen,pX_screen+blockW*cos(pA),pY_screen+blockW*sin(pA));

}

function checkWin() {
  if (playerTile() == "!")
    init();

}

function init() {

  let maze = generateMaze(mazeWidth,mazeHeight,noiseFactor);
  map = rasterizeMaze(maze);
  mapW = map[0].length, mapH = map.length;
  map[mapH-2][mapW-2] = '!';

  blockW = min(width/mapW,height/mapW);
  blockH = 100; //pour la 3D uniquement

  pX = 1.5, pY = 1.5;
  pVX = 0, pVY = 0;
  pAcc = 0.005, friction = 0.95;
  pA = 0;

}

function updatePlayer() {

  if (keyIsDown(LEFT_ARROW)) {
    pA -= 0.05;
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    pA += 0.05;
  }

  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));

  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: pVX += cos(pA)*pAcc; pVY += sin(pA)*pAcc; break;
    case 0b0100: pVX += sin(pA)*pAcc; pVY -= cos(pA)*pAcc; break;
    case 0b0010: pVX -= cos(pA)*pAcc; pVY -= sin(pA)*pAcc; break;
    case 0b0001: pVX -= sin(pA)*pAcc; pVY += cos(pA)*pAcc; break;
    case 0b1100: pVX += pAcc*(cos(pA)+sin(pA))/sqrt(2);  pVY += pAcc*(sin(pA)-cos(pA))/sqrt(2);  break;
    case 0b1001: pVX += pAcc*(cos(pA)-sin(pA))/sqrt(2);  pVY += pAcc*(sin(pA)+cos(pA))/sqrt(2);  break;
    case 0b0110: pVX += pAcc*(-cos(pA)+sin(pA))/sqrt(2); pVY += pAcc*(-sin(pA)-cos(pA))/sqrt(2); break;
    case 0b0011: pVX += pAcc*(-cos(pA)-sin(pA))/sqrt(2); pVY += pAcc*(-sin(pA)+cos(pA))/sqrt(2); break;
  }

  pVX *= friction, pVY *= friction;

  if (map[floor(pY)][floor(pX+pVX)] == '#')
    pVX = 0;
  if (map[floor(pY+pVY)][floor(pX)] == '#')
    pVY = 0;

  pX += pVX, pY += pVY;



}

function playerVelocity() {
  return sqrt(pVX*pVX + pVY*pVY);
}

function playerTile() {
  return map[floor(pY)][floor(pX)];
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

  let mp = array2DInit(2*sizeX+1,2*sizeY+1,'#');


  for (let x=0; x<sizeX; x++) {
    for (let y=0; y<sizeY; y++) {

      let walls = mz[y][x];
      let mpX = 2*x+1;
      let mpY = 2*y+1

      mp[mpY][mpX] = ' ';   //CELL

      if ((walls & 8) != 0)  //HAUT
        mp[mpY-1][mpX] = ' ';

      if ((walls & 4) != 0)  //DROITE
        mp[mpY][mpX+1] = ' ';

      if ((walls & 2) != 0)  //BAS
        mp[mpY+1][mpX] = ' ';

      if ((walls & 1) != 0)  //GAUCHE
        mp[mpY][mpX-1] = ' ';


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
