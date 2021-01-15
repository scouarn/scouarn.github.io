
function wander(ant) {

  switch (int(random(4))) {
    case 0:
      ant.x = max(ant.x-1,0);
      break;

    case 1:
      ant.y = max(ant.y-1,0);
      break;

    case 2:
      ant.x = min(ant.x+1,cols-1);
      break;

    case 3:
      ant.y = min(ant.y+1,rows-1);
      break;
  }

  
}


function initAnts(pop, pX, pY) {

  let ants = [];

  for (let i = 0; i < pop; i++)
    ants.push({
      x : pX,
      y : pY,
      update : wander
    });

  return ants;

}
