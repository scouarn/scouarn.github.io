let cells;
let ants;

let rows;
let cols;
let resX;
let resY;

function setup() {

  createCanvas(600,600);
  frameRate(60);

  rows = 100;
  cols = 100;
  resX = width/cols;
  resY = height/rows;

  cells = Array.from(Array(cols), () => new Array(rows));

  for (let i = 0; i < cols; i++)
  for (let j = 0; j < rows; j++)
    cells[i][j] =
      {
        home : 0,
        food : 0,
        wall : false
      };

  for (let i = 0; i < 75; i++)
    ants.push({
      x : rows/2,
      y : cols/2,
      update : explore
    });

}


function draw() {
  background(0);

  noStroke();
  for (let x = 0; x < cols; x++)
  for (let y = 0; y < rows; y++) {
      fill(cells[x][y].food);
      rect(x*resX,y*resY,resX,resY);
      cell.food *= 0.99;
  }

  strokeWeight(5);
  stroke(255,0,0);
  translate(resX/2, resY/2)
  for (let a of ants) {
    a.update(a);
    point(a.x*resX, a.y*resY);
  }

}




function explore(ant) {

  //put food or home or explore
  //avoid home and food and explore
  //if find food, come back

  cells[ant.x][ant.y].food = 255;



  let neigs = [Infinity,Infinity,Infinity,Infinity];

  if (ant.y-1 >= 0)   neigs[0] = (cells[ant.x][ant.y-1].home + cells[ant.x][ant.y-1].food);
  if (ant.x+1 < cols) neigs[1] = (cells[ant.x+1][ant.y].home + cells[ant.x+1][ant.y].food);
  if (ant.y+1 < rows) neigs[2] = (cells[ant.x][ant.y+1].home + cells[ant.x][ant.y+1].food);
  if (ant.x-1 >= 0)   neigs[3] = (cells[ant.x-1][ant.y].home + cells[ant.x-1][ant.y].food);

  function makeChoice() {
    let ch = int(random(4));

    switch (ch) {
      case 0:
        if (neigs[0] > neigs[1] || neigs[0] > neigs[3]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,0);
          break;
        }

      case 1:
        if (neigs[1] > neigs[2] || neigs[1] > neigs[0]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,1);
          break;
        }

      case 2:
        if (neigs[2] > neigs[3] || neigs[2] > neigs[1]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,2);
          break;
        }

      case 3:
        if (neigs[3] > neigs[0] || neigs[3] > neigs[2]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,3);
          break;
        }
    }
  }
  makeChoice();

}


function wander(ant, choice) {

  //put nothing
  //follow nothing

  switch (choice) {
    case 3:
      ant.x = max(ant.x-1,0);
      break;

    case 0:
      ant.y = max(ant.y-1,0);
      break;

    case 1:
      ant.x = min(ant.x+1,cols-1);
      break;

    case 2:
      ant.y = min(ant.y+1,rows-1);
      break;
  }


}
