let cvs = document.getElementById("gameCanvas");
let fpsBox = document.getElementById("fpsbox");
cvs.width = 600; cvs.height = 600;
ctx = cvs.getContext("2d");
ctx.font = "12px Arial";

ctx.fillStyle = "black";
ctx.fillRect(0,0,cvs.width,cvs.height);

window.addEventListener( "keydown", onKeyPress, false )
window.addEventListener( "keyup", onKeyReleased, false )

let running = false;

let mouseX = 0;
let movedX = 0;

let tp1 = performance.now();
let tp2 = performance.now();
let elapsedTime;

const InvSqrt2 = 1/Math.sqrt(2);

///////////////////////////

let Z_DOWN = false;
let Q_DOWN = false;
let S_DOWN = false;
let D_DOWN = false;
let LT_DOWN = false;
let RT_DOWN = false;
let M_DOWN = false;

//////////////////////////

let mazeWidth = 5;
let mazeHeight= 5;
let noiseFactor = 0.8;

//map attributes
let map;
let mapW, mapH;
let tileW;
let showMap = false;

//player attributes
let pX, pY;
let pVX, pVY;
let pAcc, friction;
let pA; let turnRate;

//camera attributes
let fov; let anglePerCol;
let blockH; let screenDist;
let colWidth = 6;


function loop() {

  tp1 = performance.now();
  elapsedTime = tp1-tp2
  tp2 = tp1;

  updatePlayer();
  checkWin();

  if (M_DOWN)
    render2D();
  else
    render3D();



  displayInfo();

  if (running) {
    requestAnimationFrame(loop);
  }
  else {
    ctx.fillStyle = "black";
    ctx.fillRect(0,0,cvs.width,cvs.height);
  }

}

function onKeyPress(e) {

  if ( e.keyCode == 90 ) //Z
    Z_DOWN = true;
  if ( e.keyCode == 81 ) //Q
    Q_DOWN = true;
  if ( e.keyCode == 83 ) //S
    S_DOWN = true;
  if ( e.keyCode == 68 ) //D
    D_DOWN = true;
  if ( e.keyCode == 37 ) //LEFT
    LT_DOWN = true;
  if ( e.keyCode == 39 ) //RIGHT
    RT_DOWN = true;
  if ( e.keyCode == 77 ) //M
    M_DOWN = true;

}

function onKeyReleased(e) {

  if ( e.keyCode == 90 ) //Z
    Z_DOWN = false;
  if ( e.keyCode == 81 ) //Q
    Q_DOWN = false;
  if ( e.keyCode == 83 ) //S
    S_DOWN = false;
  if ( e.keyCode == 68 ) //D
    D_DOWN = false;
  if ( e.keyCode == 37 ) //LEFT
    LT_DOWN = false;
  if ( e.keyCode == 39 ) //RIGHT
    RT_DOWN = false;
  if ( e.keyCode == 77 ) //M
    M_DOWN = false;

}

function render3D() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,cvs.width,cvs.height);
  ctx.lineWidth = colWidth;

  let initialAngle = pA - fov/2;
  let pfX = Math.floor(pX); let pfY = Math.floor(pY);
  let pdX = pX - pfX;  let pdY = pY - pfY;

  for (x = 0; x < cvs.width; x+=colWidth) {

    let rayAngle = initialAngle + x*anglePerCol;
    let TANA = Math.tan(rayAngle);


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

    let perspectiveDist = trueDist*Math.cos(rayAngle-pA);
    let wallHeight = (blockH/perspectiveDist)*screenDist;

    let shade = Math.floor(220/(trueDist*2+1));


    switch (getTile(finalX,finalY)) {
      case 0: ctx.strokeStyle = cssColor(shade,shade,shade); break;
      case 2: ctx.strokeStyle = "#00FF00"; break;
      default : ctx.strokeStyle = "red";
    }

    ctx.beginPath();
    ctx.moveTo(x,cvs.height/2-wallHeight*0.5);
    ctx.lineTo(x,cvs.height/2+wallHeight*0.5);
    ctx.stroke();

  }

}

function render2D() {
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,cvs.width,cvs.height);


  //scene
  for (x = 0; x < mapW; x++)
    for (y = 0; y < mapH; y++) {
      switch (getTile(x,y)) {
        case 0: ctx.fillStyle = "black"; break;
        case 1: ctx.fillStyle = "white"; break;
        case 2: ctx.fillStyle = "#00FF00"; break;
        default: ctx.fillStyle = "red"; break;

      }
      ctx.fillRect(x*tileW,y*tileW,tileW,tileW);
    }

  //player
  let pX_screen = pX*tileW;
  let pY_screen = pY*tileW;

  ctx.beginPath();
  ctx.arc(pX_screen,pY_screen,tileW*0.25,0,Math.PI*2,false);
  ctx.fillStyle = "#00FF00";
  ctx.fill();

  ctx.beginPath();
  ctx.strokeStyle = "#00FF00";
  ctx.moveTo(pX_screen,pY_screen);
  ctx.lineTo(pX_screen+tileW*Math.cos(pA),pY_screen+tileW*Math.sin(pA));
  ctx.stroke();

}

function displayInfo() {
  ctx.fillStyle = "white";
  ctx.fillText(Math.floor(fps()*10)/10, 10, 15);

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

  tileW = Math.min(cvs.width/mapW,cvs.height/mapW);

  pX = 1.5, pY = 1.5;
  pVX = 0, pVY = 0;
  pAcc = 0.008, friction = 0.95;

  turnRate = 0.06;

  if (getTile(2,1) == 0)
    pA = Math.PI/2;
  else
    pA = 0;

}

function initCamera() {
  fov = Math.PI/3;
  blockH = 1;
  screenDist = (cvs.width/2)/Math.tan(fov/2);
  anglePerCol = fov/cvs.width;
}

function updatePlayer() {

  if (LT_DOWN) {
    pA -= turnRate;
  }
  else if (RT_DOWN) {
    pA += turnRate;
  }
  else {
    //pA += Math.atan(movedX/screenDist);
  }

  let keys = (Z_DOWN << 3) | (Q_DOWN << 2) | (S_DOWN << 1) | (D_DOWN);

  let COSPA = Math.cos(pA); let SINPA = Math.sin(pA);


  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: pVX += COSPA*pAcc; pVY += SINPA*pAcc; break;
    case 0b0100: pVX += SINPA*pAcc; pVY -= COSPA*pAcc; break;
    case 0b0010: pVX -= COSPA*pAcc; pVY -= SINPA*pAcc; break;
    case 0b0001: pVX -= SINPA*pAcc; pVY += COSPA*pAcc; break;
    case 0b1100: pVX += pAcc*(COSPA+SINPA)*InvSqrt2;  pVY += pAcc*(SINPA-COSPA)*InvSqrt2;  break;
    case 0b1001: pVX += pAcc*(COSPA-SINPA)*InvSqrt2;  pVY += pAcc*(SINPA+COSPA)*InvSqrt2;  break;
    case 0b0110: pVX += pAcc*(-COSPA+SINPA)*InvSqrt2; pVY += pAcc*(-SINPA-COSPA)*InvSqrt2; break;
    case 0b0011: pVX += pAcc*(-COSPA-SINPA)*InvSqrt2; pVY += pAcc*(-SINPA+COSPA)*InvSqrt2; break;
  }

  pVX *= friction, pVY *= friction;

  if (getTile(pX+pVX,pY) == 0)
    pVX = 0;
  if (getTile(pX,pY+pVY) == 0)
    pVY = 0;

  pX += pVX, pY += pVY;



}

function getTile(x,y) {
  return map[Math.floor(y)][Math.floor(x)];
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

function cssColor(r,g,b) {
  return "rgb("+r+','+g+','+b+")"
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

      if ([1,2,4,8].includes(mz[y][x]) && Math.random()<noise) { //dead ends
        let side = Math.floor(Math.random()*4);

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

  let i = Math.floor(Math.random()*arr.length);

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

function fps() {
  return 1000/elapsedTime;
}

function start() {
  document.getElementById("playButton").hidden = true;
  document.getElementById("exitButton").hidden = false;

  running = true;
  initGame();
  initCamera();
  loop();
}

function stop() {
  document.getElementById("playButton").hidden = false;
  document.getElementById("exitButton").hidden = true;

  running = false;

}
