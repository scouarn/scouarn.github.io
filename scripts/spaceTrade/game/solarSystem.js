class SolarSystem {

  constructor(dumSys) {
    this.info = dumSys;

    this.planets = [];
    this.otherBodies = [];
    this.allChildren = [];
  }

  appendChild(body) {
    if (body instanceof Planet)
      this.planets.push(body);
    else
      this.otherBodies.push(body);

    this.allChildren.push(body)
  }
  appendPlanet(planet,parent = undefined, alt = 1000 + planet.radius) {
    if (parent != undefined) {
      planet.setOrbit(parent, alt);
    }
    this.appendChild(planet);

  }

  updateChildren() {
    for (let child of this.allChildren) {
      child.applyGravity();
    }

    for (let child of this.allChildren) {
      child.updatePos();
    }

  }

  displayPlanets() {
    for (let p of this.planets)
      p.display();

  }

}

class DummySystem {

  constructor(id,pos) {
    this.id = id;
    this.pos = pos;
    this.seed = id + currentGalaxy.seed;

    this.beaconName = (this.seed)%1000 + "-";
      let r = pos.mag();
      let a = pos.heading();
      if (pos.y < 0) {this.beaconName += "N"; a += PI;} else this.beaconName += "S";
      if (pos.x > 0) this.beaconName += "E"; else this.beaconName += "W";
      if (r < 0.25) this.beaconName += "0";
      else if (r < 0.5) this.beaconName += "1";
      else if (r < 0.75) this.beaconName += "2";
      else this.beaconName += "3";
      this.beaconName += "-" + floor(degrees(a))%90;

  }

  promote() {
    let sys = new SolarSystem(this);
    return sys;
  }

}
