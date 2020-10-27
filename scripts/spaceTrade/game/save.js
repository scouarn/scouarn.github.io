
function newGame() {

    currentGalaxy = new Galaxy();
    currentSystem = new SolarSystem(currentGalaxy,0);

    playerShip = new Ship();
    playerShip.parentSystemId = 0;
    playerShip.ftlTargetId    = 0;
    playerShip.setOrbit(currentSystem.majorBodies[1], 100);
    currentSystem.appendChild(playerShip);
    playerShip.autopilot.setTarget(currentSystem.majorBodies[1]);


}

function saveGame() {
  let save = {
    "seed": currentGalaxy.seed,
    "playerShip": {"pos": playerShip.pos.array(),
                   "vel": playerShip.vel.array(),
                  },
    "majorBodies": [],
    "currentSystemId" : currentSystem.id,
  };

  for (let p of currentSystem.majorBodies) {
    save.majorBodies.push({
      "pos": p.pos.array(),
      "vel": p.vel.array()
    });
  }

  window.localStorage.setItem("save", JSON.stringify(save));

}

function loadSave() {
  let save   = JSON.parse(window.localStorage.getItem("save"));

  currentGalaxy = new Galaxy(save.seed);

  currentSystem = new SolarSystem(currentGalaxy,save.currentSystemId);
  for (let i = 0; i < currentSystem.majorBodies.length; i++) {
    currentSystem.majorBodies[i].pos.set(save.majorBodies[i].pos);
    currentSystem.majorBodies[i].vel.set(save.majorBodies[i].vel);
  }

  playerShip = new Ship();
  playerShip.pos.set(save.playerShip.pos);
  playerShip.vel.set(save.playerShip.vel);

  playerShip.parentSystemId = save.currentSystemId;
  playerShip.ftlTargetId    = save.currentSystemId;

  playerShip.updateParent();
  playerShip.autopilot.setTarget(playerShip.parent);
  currentSystem.appendChild(playerShip);
}

function eraseSave() {
  window.localStorage.clear();
}

function thereIsASave() {
  return window.localStorage.save != undefined;
}
