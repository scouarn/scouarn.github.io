
const APModes = {
  OFF : "OFF",
  KIL : "KIL",

  PRO : "PRO",
  RET : "RET",

  TOW : "OB+",
  AWY : "OB-",

  TGT : "TG+",
  ATG : "TG-",

  REL : "RL+",
  ARL : "RL-"
};

const APFunctions = {
  OFF : (ap) => {},
  KIL : (ap) => {},

  PRO : (ap) => {ap.ship.rot = ap.ship.vel.heading();},
  RET : (ap) => {ap.ship.rot = PI + ap.ship.vel.heading();},

  TOW : (ap) => {ap.ship.rot = HALF_PI + ap.ship.vel.heading();},
  AWY : (ap) => {ap.ship.rot = -HALF_PI + ap.ship.vel.heading();},

  TGT : (ap) => {ap.ship.rot = p5.Vector.sub(ap.target.pos,ap.ship.pos).heading();},
  ATG : (ap) => {ap.ship.rot = p5.Vector.sub(ap.ship.pos,ap.target.pos).heading();},

  REL : (ap) => {ap.ship.rot = p5.Vector.sub(ap.ship.vel,ap.target.vel).heading();},
  ARL : (ap) => {ap.ship.rot = p5.Vector.sub(ap.target.vel,ap.ship.vel).heading();}
};

class Autopilot {
  constructor(ship) {
    this.modeFunction = APFunctions.OFF;
    this.modeName = APModes.OFF;
    this.ship = ship;
    this.target = ship.parent;
  }

  update() {
    this.modeFunction(this);
  }

  setMode(key) {
    this.modeFunction = APFunctions[key];
    this.modeName = APModes[key];;
  }

  getModeFunction() {
    return this.modeFunction;
  }
  getModeName() {
    return this.modeName;
  }

  setTarget(body) {
    this.target = body;
  }
  getTarget() {
    return this.target;
  }

}
