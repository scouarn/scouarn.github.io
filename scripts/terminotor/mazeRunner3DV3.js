p5.disableFriendlyErrors = true; // disables FES

let mazeWidth = 5;
let mazeHeight= 5;
let noiseFactor = 0.8;


//map attributes
let map;
let mapW, mapH;
let tileW;

//player attributes
let pX, pY;
let pVX, pVY;
let pAcc, friction;
let pA; let turnRate; let pvA;

//camera attributes
let fov; let anglePerCol;
let blockH; let screenDist;
let colWidth;
let heightOffset;

let showMap = false;
let focused = false;

function preload() {

}

function setup() {
  createCanvas(600,600);
  initGame();
  initCamera();
}

function draw() {

  updatePlayer();
  checkWin();

  if (showMap)
    render2D();
  else
    render3D();

  displayHUD();
}

function keyPressed() {
  if (key == "m")
    showMap = !showMap;

  if (keyCode == 27)
    focused = false;
}

function mouseClicked() {
  requestPointerLock();
  focused = true;
}

function render3D() {

  let center = height/2 + heightOffset;
  noStroke();
  fill(0);
  rect(0,0,width,center);
  fill(20);
  rect(0,center,width,height-center);

  strokeWeight(colWidth);
  strokeCap(SQUARE);

  let initialAngle = pA - fov/2;
  let pfX = floor(pX); let pfY = floor(pY);
  let pdX = pX - pfX;  let pdY = pY - pfY;

  for (x = 0; x < width; x+=colWidth) {

    let rayAngle = initialAngle + x*anglePerCol;
    let TANA = tan(rayAngle);


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


    if (Math.sin(rayAngle) > 0) { //BAS
      hIntX = pX + (1-pdY)/TANA;
      hIntY = pfY + 1;

      hIntDY = 1;
      hIntDX = 1/TANA;
    }
    else {             //HAUT
      hIntX = pX - pdY/TANA;
      hIntY = pfY - 0.0001;

      hIntDY = -1;
      hIntDX = -1/TANA;
    }

    if (Math.cos(rayAngle) > 0) { //DROITE
      vIntX = pfX +1;
      vIntY = pY + (1-pdX)*TANA;

      vIntDX = 1;
      vIntDY = TANA;
    }
    else {             //GAUCHE
      vIntX = pfX - 0.0001;
      vIntY = pY - pdX*TANA;

      vIntDX = -1;
      vIntDY = -TANA;
    }


    //trace ray

    //check horizontal intersection :
    let hInt = false;
    while (hInt == false){

      if (outOfBounds(hIntX,hIntY))
        break;
      else if (getTile(hIntX,hIntY) != 1)
        hInt = true;
      else {
        hIntX += hIntDX;
        hIntY += hIntDY;
      }
    }

    //check vertical intersection :
    let vInt = false;
    while (vInt == false) {

      if (outOfBounds(vIntX,vIntY)) {
        break;
      }
      else if (getTile(vIntX,vIntY) != 1)
        vInt = true;
      else {
        vIntX += vIntDX;
        vIntY += vIntDY;
      }
    }

    let hDist = (hIntX-pX)*(hIntX-pX) + (hIntY-pY)*(hIntY-pY);
    let vDist = (vIntX-pX)*(vIntX-pX) + (vIntY-pY)*(vIntY-pY);
    let trueDist;

    let finalX;
    let finalY;

    if (hDist < vDist) {
      trueDist = Math.sqrt(hDist);
      finalX = hIntX;
      finalY = hIntY;
    }
    else {
      trueDist = Math.sqrt(vDist);
      finalX = vIntX;
      finalY = vIntY;
    }

    let perspectiveDist = trueDist*Math.cos(rayAngle-pA); //dist > 0 quand FOV<PI car du coup cos>0
    let halfWallHeight = (blockH/perspectiveDist)*screenDist*0.5;


    let shade = Math.floor(220/(trueDist*2+1));

    let col = color(0);

    switch (getTile(finalX,finalY)) {
      case 0: col = color(min(shade,200)); break;
      case 2: col = color(0,255,0); break;
    }
    stroke(col);
    line(x,center-halfWallHeight,x,center+halfWallHeight);

  }

}

function render2D() {
  background(0);

  noStroke();

  //scene
  for (x = 0; x < mapW; x++)
    for (y = 0; y < mapH; y++) {
      switch (getTile(x,y)) {
        case 0: fill(0); break;
        case 1: fill(255); break;
        case 2: fill(50,255,50); break;
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
  strokeWeight(1);
  line(pX_screen,pY_screen,pX_screen+tileW*Math.cos(pA),pY_screen+tileW*Math.sin(pA));


}

function displayHUD() {
  fill(255);
  noStroke();
  text(dRound(frameRate()),10,15);

  strokeWeight(5);
  stroke(255);
  point(width/2,height/2);


}

function checkWin() {
  if (getTile(pX,pY) == 2)
    initGame();
}

function initGame() {

  let maze = generateMaze(mazeWidth,mazeHeight,noiseFactor);
  map = rasterizeMaze(maze);
  mapW = map[0].length, mapH = map.length;
  map[mapH-1][mapW-2] = 2;

  tileW = min(width/mapW,height/mapW);

  pX = 1.5, pY = 1.5;
  pVX = 0, pVY = 0;
  pAcc = 0.007, friction = 0.92;

  turnRate = 0.06;

  if (getTile(2,1) == 0)
    pA = PI/2;
  else
    pA = 0;

  pvA = 0;
}

function initCamera() {
  fov = radians(75);
  blockH = 1;
  screenDist = (width/2)/tan(fov/2);
  anglePerCol = fov/width;
  colWidth = 6;
}

function updatePlayer() {

  if (focused) {
    pA += Math.atan(movedX/screenDist);
    pvA = constrain(pvA-movedY,-height,height);
  }

  heightOffset = pvA;



  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));
  let COSPA = Math.cos(pA); let SINPA = Math.sin(pA);

  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: pVX += COSPA*pAcc; pVY += SINPA*pAcc; break;
    case 0b0100: pVX += SINPA*pAcc; pVY -= COSPA*pAcc; break;
    case 0b0010: pVX -= COSPA*pAcc; pVY -= SINPA*pAcc; break;
    case 0b0001: pVX -= SINPA*pAcc; pVY += COSPA*pAcc; break;
    case 0b1100: pVX += pAcc*(COSPA+SINPA)/sqrt(2);  pVY += pAcc*(SINPA-COSPA)/sqrt(2);  break;
    case 0b1001: pVX += pAcc*(COSPA-SINPA)/sqrt(2);  pVY += pAcc*(SINPA+COSPA)/sqrt(2);  break;
    case 0b0110: pVX += pAcc*(-COSPA+SINPA)/sqrt(2); pVY += pAcc*(-SINPA-COSPA)/sqrt(2); break;
    case 0b0011: pVX += pAcc*(-COSPA-SINPA)/sqrt(2); pVY += pAcc*(-SINPA+COSPA)/sqrt(2); break;
  }

  pVX *= friction, pVY *= friction;

  if (getTile(pX+pVX,pY) == 0)
    pVX = 0;
  if (getTile(pX,pY+pVY) == 0)
    pVY = 0;

  pX += pVX, pY += pVY;



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

  let mp = array2DInit(2*sizeX+1,2*sizeY+1,0);


  for (let x=0; x<sizeX; x++) {
    for (let y=0; y<sizeY; y++) {

      let walls = mz[y][x];
      let mpX = 2*x+1;
      let mpY = 2*y+1

      mp[mpY][mpX] = 1;   //CELL

      if ((walls & 8) != 0)  //HAUT
        mp[mpY-1][mpX] = 1;

      if ((walls & 4) != 0)  //DROITE
        mp[mpY][mpX+1] = 1;

      if ((walls & 2) != 0)  //BAS
        mp[mpY+1][mpX] = 1;

      if ((walls & 1) != 0)  //GAUCHE
        mp[mpY][mpX-1] = 1;


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
