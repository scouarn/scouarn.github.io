

function initAnts(pop, pX, pY) {

  let ants = [];

  for (let i = 0; i < pop; i++)
    ants.push({
      x : pX,
      y : pY,
      update : explore
    });

  return ants;

}

function explore(ant) {

  //put home
  //avoid home and food
  //if find food, come back

  cells[ant.x][ant.y].home = 255;

  stroke(255,0,0);
  point(ant.x*resX, ant.y*resY);


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
          return;
        }

      case 1:
        if (neigs[1] > neigs[2] || neigs[1] > neigs[0]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,1);
          return;
        }

      case 2:
        if (neigs[2] > neigs[3] || neigs[2] > neigs[1]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,2);
          return;
        }

      case 3:
        if (neigs[3] > neigs[0] || neigs[3] > neigs[2]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,3);
          return;
        }
    }
  }
  makeChoice();



}

function comeBack(ant) {

  //put food
  //follow home
  //if find home, explore or forage

  cells[ant.x][ant.y].food = 255;

  stroke(0,255,0);
  point(ant.x*resX, ant.y*resY);


  let neigs = [-Infinity,-Infinity,-Infinity,-Infinity];

  if (ant.y-1 >= 0)   neigs[0] = (cells[ant.x][ant.y-1].home);
  if (ant.x+1 < cols) neigs[1] = (cells[ant.x+1][ant.y].home);
  if (ant.y+1 < rows) neigs[2] = (cells[ant.x][ant.y+1].home);
  if (ant.x-1 >= 0)   neigs[3] = (cells[ant.x-1][ant.y].home);

  function makeChoice() {
    let ch = int(random(4));

    switch (ch) {
      case 0:
        if (neigs[0] < neigs[1] || neigs[0] < neigs[3]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,0);
          return;
        }

      case 1:
        if (neigs[1] < neigs[2] || neigs[1] < neigs[0]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,1);
          return;
        }

      case 2:
        if (neigs[2] < neigs[3] || neigs[2] < neigs[1]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,2);
          return;
        }

      case 3:
        if (neigs[3] < neigs[0] || neigs[3] < neigs[2]) {
          makeChoice();
          break;
        }
        else {
          wander(ant,3);
          return;
        }
    }
  }
  makeChoice();

}

function forage(ant) {

  //put home
  //follow food
  //if find food, come back

  cells[ant.x][ant.y].home = 255;

  wander(ant);

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
