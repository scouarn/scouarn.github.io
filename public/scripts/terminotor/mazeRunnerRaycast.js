let mazeWidth = 5;
let mazeHeight= 5;
let noiseFactor = 0.8;

let map;
let mapW, mapH;
let tileW;
let pX, pY;
let pVX, pVY;
let pAcc, friction;
let pA; let turnRate;

let fov; let blockH;

let showMap = false;

function setup() {

  createCanvas(600,600);
  init();

}

function draw() {

  render2D();
  raycast();

  updatePlayer();
  checkWin();

}

function raycast() {


  let pfX = floor(pX); let pfY = floor(pY);
  let pdX = pX - pfX;  let pdY = pY - pfY;

  let TANA = tan(pA);


  //première intersection

  let hIntX;
  let hIntY;

  let vIntX;
  let vIntY;




  //distance à la prochaine intersection
  let hIntDX;
  let hIntDY;

  let vIntDX;
  let vIntDY;


  fill(255);
  noStroke();

  text("sin="+dRound(sin(pA)),100,15);
  text("cos="+dRound(cos(pA)),100,30);
  text("tan="+dRound(tan(pA)),100,45);
  text("pA="+dRound(pA),10,45);

  if (sin(pA) > 0) { //BAS
    text("bas",10,15);

    hIntX = pX + (1-pdY)/TANA;
    hIntY = pfY + 1;

    hIntDY = 1;
    hIntDX = 1/TANA;

  }
  else {             //HAUT
    text("haut",10,15);

    hIntX = pX - pdY/TANA;
    hIntY = pfY - 0.01;

    hIntDY = -1;
    hIntDX = -1/TANA;


  }

  if (cos(pA) > 0) { //DROITE
    text("droite",10,30);

    vIntX = pfX +1;
    vIntY = pY + (1-pdX)*TANA;

    vIntDX = 1;
    vIntDY = TANA;

  }
  else {             //GAUCHE
    text("gauche",10,30);

    vIntX = pfX - 0.01;
    vIntY = pY - pdX*TANA;

    vIntDX = -1;
    vIntDY = -TANA;

  }



  strokeWeight(5);


  //trace ray

  //check horizontal intersection :
  let hInt = false;
  while (hInt == false){

    stroke(255,0,0);
    point(hIntX*tileW,hIntY*tileW);

    if (outOfBounds(hIntX,hIntY))
      hInt = true;
    else if (getTile(hIntX,hIntY) == '#')
      hInt = true;
    else {
      hIntX += hIntDX;
      hIntY += hIntDY;
    }
  }


  //check vertical intersection :
  let vInt = false;
  while (vInt == false) {

    stroke(0,0,255);
    point(vIntX*tileW,vIntY*tileW);

    if (outOfBounds(vIntX,vIntY)) {
      vInt = true;
    }
    else if (getTile(vIntX,vIntY) == '#')
      vInt = true;
    else {
      vIntX += vIntDX;
      vIntY += vIntDY;
    }
  }

    let hDist = vecLength(hIntX-pX, hIntY-pY);
    let vDist = vecLength(vIntX-pX, vIntY-pY);

    text(dRound(hDist),10,45);
    text(dRound(vDist),10,60);

    let perspectiveDist;
    if (hInt && vInt) {
      perspectiveDist = min(hDist,vDist);

    }
    else if (hInt)
      perspectiveDist = hDist;
    else if (vInt)
      perspectiveDist = vDist;


    let wallHeight = blockH / perspectiveDist;
    let center = height/2;
    line(width/2,center-wallHeight*0.5,width/2,center+wallHeight*0.5);

}

function render2D() {
  background(0);

  noStroke();

  //scene
  for (x = 0; x < mapW; x++)
    for (y = 0; y < mapH; y++) {
      switch (getTile(x,y)) {
        case "#": fill(0); break;
        case " ": fill(255); break;
        case "!": fill(50,255,50); break;
        default: fill(255,0,0); break;

      }
      rect(x*tileW,y*tileW,tileW,tileW);
    }

  //player
  let pX_screen = pX*tileW;
  let pY_screen = pY*tileW;

  fill(0,255,0);
  ellipse(pX_screen,pY_screen,tileW*0.5,tileW*0.5);
  stroke(0,255,0);
  strokeWeight(1)
  line(pX_screen,pY_screen,pX_screen+tileW*cos(pA),pY_screen+tileW*sin(pA));

}

function keyPressed() {
  if (key == "m")
    showMap = !showMap;
}

function checkWin() {
  if (getTile(pX,pY) == "!")
    init();
}

function init() {

  let maze = generateMaze(mazeWidth,mazeHeight,noiseFactor);
  map = rasterizeMaze(maze);
  mapW = map[0].length, mapH = map.length;
  map[mapH-2][mapW-2] = '!';

  tileW = min(width/mapW,height/mapW);

  pX = 1.5, pY = 1.5;
  pVX = 0, pVY = 0;
  pAcc = 0.005, friction = 0.95;
  pA = 0; turnRate = 0.05;
  fov = radians(60); blockH = 300;

}

function updatePlayer() {

  if (keyIsDown(LEFT_ARROW)) {
    pA = (pA-turnRate);
  }
  else if (keyIsDown(RIGHT_ARROW)) {
    pA = (pA+turnRate);
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

  if (getTile(pX+pVX,pY) == '#')
    pVX = 0;
  if (getTile(pX,pY+pVY) == '#')
    pVY = 0;

  pX += pVX, pY += pVY;



}

function vecLength(x,y) {
  return sqrt(x*x + y*y);
}

function getTile(x,y) {
  return map[floor(y)][floor(x)];
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

function dRound(x) {
  return floor(x*10)/10
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
