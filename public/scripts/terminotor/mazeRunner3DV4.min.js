const MENU = 0;
const GAME = 1;

let map;
let player;

let menuButtons = [];

let state;

function setup() {
  createCanvas(600,600);
  initMenu();
}

function draw() {

  switch (state) {
    case MENU : displayMenu(); break;
    case GAME : player.update(); break;
  }


}

function keyPressed() {

  switch (state) {
    case GAME : player.onkeyPress(); if (keyCode == 27) initMenu(); break;
  }

}

function mouseClicked() {
  switch (state) {
    case MENU : for(b of menuButtons) if (b.mouseHover()) b.onClick(); break;
    case GAME : player.onClick(); break;
  }
}


function initGame() {
  state = GAME;

  map = new Map(5,5,0.8);


  if (map.getTile(2,1) == 0)
    player.hA = PI/2;

}

function init2D() {
  player = new Player(moveHover2D,render2D,displayFPS,init2D);
  initGame();
}

function init3D() {
  player = new Player(moveHover3D,render3D,displayFPS,init3D);
  initGame();
}

function initMenu() {
  state = MENU;

  menuButtons.push(new Button(width/2-100,height/2,150,50,"Play 3D",init3D));
  menuButtons.push(new Button(width/2+100,height/2,150,50,"Play 2D",init2D));
}

function render2D() {
  const fov = Math.PI/2;
  const colw = 6;
  const tileW = min(width/map.width,height/map.height);

  let pX_screen = this.pX*tileW;
  let pY_screen = this.pY*tileW;

  this.hA = Math.atan((mouseY-height/2)/(mouseX-width/2));
  if (mouseX-width/2 < 0)
    this.hA += Math.PI;

  background(0);
  push();
  translate(width/2 - pX_screen,height/2 - pY_screen);

  stroke(255);
  strokeWeight(colw);
  strokeCap(SQUARE);

  let rays = rayCast(this.pX,this.pY,this.hA,fov,800,colw);

  for (r of rays)
    line(pX_screen,pY_screen,tileW*r.x,tileW*r.y);


  for (r of rays) {
    if (map.getTile(r.x,r.y) == 2) {
      stroke(0,255,0);
      point(tileW*r.x,tileW*r.y);
    }
  }

  noStroke();
  fill(0,255,0);
  ellipse(pX_screen,pY_screen,tileW*0.5,tileW*0.5);
  stroke(0,255,0);
  strokeWeight(3);
  line(pX_screen,pY_screen,pX_screen+tileW*Math.cos(this.hA),pY_screen+tileW*Math.sin(this.hA));

  pop();
}

function render3D() {
  const fov = Math.PI/3;
  const colw = 6;
  const screenDist = (width/2)/tan(fov/2);

  this.hA += Math.atan(movedX/screenDist);
  this.vA = constrain(this.vA-movedY,-height,height);


  let center = height/2 + this.vA;
  noStroke();
  rectMode(CORNER);
  fill(0);
  rect(0,0,width,center);
  fill(20);
  rect(0,center,width,height-center);

  strokeWeight(colw);
  strokeCap(SQUARE);


  let rays = rayCast(this.pX,this.pY,this.hA,fov,width,colw);

  for (r of rays) {

    let perspectiveDist = r.d*Math.cos(r.a-this.hA); //dist > 0 quand FOV<PI car du coup cos>0
    let halfWallHeight = (1/perspectiveDist)*screenDist*0.5;


    let shade = Math.floor(220/(r.d*2+1));

    let col = color(0);

    switch (map.getTile(r.x,r.y)) {
      case 0: col = color(min(shade,200)); break;
      case 2: col = color(0,255,0); break;
    }
    stroke(col);
    line(r.c,center-halfWallHeight,r.c,center+halfWallHeight);

  }


}

function rayCast(pX,pY,angle,fov,w,colw) {

    let values = [];

    let pfX = floor(pX); let pfY = floor(pY);
    let pdX = pX - pfX;  let pdY = pY - pfY;

    let anglePerCol = fov/w;
    let initialAngle = angle - fov/2;

    for (x = 0; x < w; x+=colw) {

      let rayAngle = initialAngle + x*anglePerCol;
      let TANA = Math.tan(rayAngle);


      //première intersection
      let hIntX; let hIntY;
      let vIntX; let vIntY;

      //distance à la prochaine intersection
      let hIntDX; let hIntDY;
      let vIntDX; let vIntDY;


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

        if (map.outOfBounds(hIntX,hIntY))
          break;
        else if (map.getTile(hIntX,hIntY) != 1)
          hInt = true;
        else {
          hIntX += hIntDX;
          hIntY += hIntDY;
        }
      }

      //check vertical intersection :
      let vInt = false;
      while (vInt == false) {

        if (map.outOfBounds(vIntX,vIntY)) {
          break;
        }
        else if (map.getTile(vIntX,vIntY) != 1)
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

      if (hInt && hDist < vDist)
        values.push({"c":x,"a":rayAngle,"x":hIntX,"y":hIntY,"d":Math.sqrt(hDist)});

      else if (vInt)
        values.push({"c":x,"a":rayAngle,"x":vIntX,"y":vIntY,"d":Math.sqrt(vDist)});

    }


  return values;
}

function Player(move,render,radar,reset) {
  this.pX = 1.5; this.pY = 1.5;
  this.vX = 0; this.vY = 0;
  this.acc = 0.007; this.friction = 0.92;
  this.turnRate = 0.06; this.hA = 0; this.vA = 0;

  this.move = move;
  this.render = render;
  this.radar = radar;
  this.onkeyPress = ()=>{};
  this.onClick = requestPointerLock;
  this.reset = reset;
}


Player.prototype.update = function() {
  if (map.getTile(this.pX,this.pY) == 2)
    this.reset();

  this.move();
  this.render();
  this.radar();

};

function moveHover3D() {


  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));
  let COSPA = Math.cos(this.hA); let SINPA = Math.sin(this.hA);

  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: this.vX += COSPA*this.acc; this.vY += SINPA*this.acc; break;
    case 0b0100: this.vX += SINPA*this.acc; this.vY -= COSPA*this.acc; break;
    case 0b0010: this.vX -= COSPA*this.acc; this.vY -= SINPA*this.acc; break;
    case 0b0001: this.vX -= SINPA*this.acc; this.vY += COSPA*this.acc; break;
    case 0b1100: this.vX += this.acc*(COSPA+SINPA)/sqrt(2);  this.vY += this.acc*(SINPA-COSPA)/sqrt(2);  break;
    case 0b1001: this.vX += this.acc*(COSPA-SINPA)/sqrt(2);  this.vY += this.acc*(SINPA+COSPA)/sqrt(2);  break;
    case 0b0110: this.vX += this.acc*(-COSPA+SINPA)/sqrt(2); this.vY += this.acc*(-SINPA-COSPA)/sqrt(2); break;
    case 0b0011: this.vX += this.acc*(-COSPA-SINPA)/sqrt(2); this.vY += this.acc*(-SINPA+COSPA)/sqrt(2); break;
  }

  this.vX *= this.friction, this.vY *= this.friction;

  if (map.getTile(this.pX+this.vX,this.pY) == 0)
    this.vX = 0;
  if (map.getTile(this.pX,this.pY+this.vY) == 0)
    this.vY = 0;

  this.pX += this.vX, this.pY += this.vY;

}

function moveHover2D() {


  let keys = (keyIsDown(90) << 3) | (keyIsDown(81) << 2) | (keyIsDown(83) << 1) | (keyIsDown(68));


  switch (keys) {
    //Z; Q; S; D; Z+Q; Z+D; S+Q; S+D
    case 0b1000: this.vY -= this.acc; break;
    case 0b0100: this.vX -= this.acc; break;
    case 0b0010: this.vY += this.acc; break;
    case 0b0001: this.vX += this.acc; break;
    case 0b1100: this.vY -= this.acc/sqrt(2); this.vX -= this.acc/sqrt(2);  break;
    case 0b1001: this.vY -= this.acc/sqrt(2); this.vX += this.acc/sqrt(2);  break;
    case 0b0110: this.vY += this.acc/sqrt(2); this.vX -= this.acc/sqrt(2); break;
    case 0b0011: this.vY += this.acc/sqrt(2); this.vX += this.acc/sqrt(2); break;
  }

  this.vX *= this.friction, this.vY *= this.friction;

  if (map.getTile(this.pX+this.vX,this.pY) == 0)
    this.vX = 0;
  if (map.getTile(this.pX,this.pY+this.vY) == 0)
    this.vY = 0;

  this.pX += this.vX, this.pY += this.vY;

}


function displayMenu() {
  background(0);
  fill(255);

  textAlign(CENTER,CENTER);
  textSize(64);
  text("TERMINOTOR",width/2,height/4);

  for (b of menuButtons) b.show();




}

function Button(x,y,w,h,label,onClick) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  this.label = label;
  this.onClick = onClick;
}

Button.prototype.show = function () {
  noFill();
  stroke(255);

  if (this.mouseHover()) strokeWeight(5);
  else strokeWeight(2);

  rectMode(CENTER);
  rect(this.x,this.y,this.w,this.h);

  fill(255);
  noStroke();
  textAlign(CENTER,CENTER);
  textSize(32);
  text(this.label,this.x,this.y);
};

Button.prototype.mouseHover = function () {
  return (mouseX > this.x-this.w/2 && mouseX < this.x+this.w/2 && mouseY > this.y-this.h/2 && mouseY < this.y+this.h/2)
};


function displayFPS() {
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT,TOP);
  text(Math.floor(frameRate()*10)/10,10,15);



}


function Map(mazeWidth,mazeHeight,noiseFactor) {

  this.cells = rasterizeMaze(generateMaze(mazeWidth,mazeHeight,noiseFactor));

  this.width = this.cells[0].length;
  this.height = this.cells.length;

  this.cells[this.height-1][this.width-2] = 2;


}

Map.prototype.getTile = function (x,y) {
  return this.cells[floor(y)][floor(x)];
};

Map.prototype.outOfBounds = function (x,y) {
  if (x < 0)
    return true;
  else if (y < 0)
    return true;
  else if (x >= this.width)
    return true;
  else if (y >= this.height)
    return true;
  else
    return false;
};

//maze generator
///////////////////
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
