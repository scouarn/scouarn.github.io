let mazeSizeX = 15;
let mazeSizeY = 15;
let noiseValue = 0.8;

function setup() {
  createCanvas(600,600);
  noLoop();
}


function draw() {
  noStroke();

  let maze = generateMaze(mazeSizeX,mazeSizeY,noiseValue);
  let map = rasterizeMaze(maze);

  let mapSizeX = map[0].length;
  let mapSizeY = map.length;
  let res = min(width/mapSizeX,height/mapSizeY);

  for (let x = 0; x < mapSizeX; x++) {
    for (let y = 0; y < mapSizeY; y++) {
        if (map[y][x]) {
          fill(255);
        }
        else {
          fill(0);
        }
        rect(x*res,y*res,res,res);

    }

  }

}

function mousePressed() {
  redraw();
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
  let mp = array2DInit(2*sizeX+1,2*sizeY,false);

  for (let x=0; x<sizeX; x++) {
    for (let y=0; y<sizeY; y++) {

      let walls = mz[y][x];
      let mpX = 2*x+1;
      let mpY = 2*y+1

      mp[mpY][mpX] = true;   //CELL

      if ((walls & 8) != 0)  //HAUT
        mp[mpY-1][mpX] = true;

      if ((walls & 4) != 0)  //DROITE
        mp[mpY][mpX+1] = true;

      if ((walls & 2) != 0)  //BAS
        mp[mpY+1][mpX] = true;

      if ((walls & 1) != 0)  //GAUCHE
        mp[mpY][mpX-1] = true;


    }
  }

  return mp;
}


function array2D(cols,rows) {

  let arr = new Array(rows);
  for (let i = 0; i<cols; i++)
    arr[i] = new Array(cols);

  return arr;

}

function array2DInit(cols,rows,value) {

  let arr = array2D(cols,rows);

  for (let x = 0; x<cols; x++)
    for (let y = 0; y<rows; y++)
      arr[y][x] = value;

  return arr;

}
