const G = 10;

class Body {
  constructor(mass = 1,name = "body") {
    this.pos = createVector(0,0);
    this.vel = createVector(0,0);
    this.mass = mass;
    this.rot = 0;
    this.rotSpeed = 0;
    this.name = name;
    this.parent;
    this.children = [];
  }

  display() {}


  getForceFromParent(body) {
    let force = p5.Vector.sub(body.pos,this.pos)
    let value = G*body.mass / max(force.magSq(),1);
    force.setMag(value);
    return force;
  }
  applyForce(vec, dt = 1) {
    this.vel.add(vec.mult(dt/this.mass))
  }
  updatePos(dt = 1) {
    this.moveRecursively(p5.Vector.mult(this.vel,dt));
    this.rot += this.rotSpeed*dt;
  }
  applyGravity(dt = 1) {
    if (this.parent != undefined)
      this.vel.add(this.getForceFromParent(this.parent).mult(dt));
  }

  moveRecursively(vec) {
    this.pos.add(vec);
    for (let child of this.children)
      child.moveRecursively(vec);
  }

  getNearest(list) {
    let record;
    let recordDistSq;

    for (let body of list) {
      let distSq = p5.Vector.sub(body.pos,this.pos).magSq();
      if (recordDistSq == undefined || distSq < recordDistSq) {
        record = body;
        recordDistSq = distSq;
      }
    }

    return record;
  }

  getStrongest(list) {
    let record;
    let recordForce;

    for (let body of list) {
      let force = this.getForceFromParent(body).magSq();

      if (body != this && (recordForce == undefined || force > recordForce)) {
        record = body;
        recordForce = force;
      }
    }
    return record;
  }

  updateParent() {
    let strongest = this.getStrongest(currentSystem.planets);
    if (strongest != this.parent)
      this.setParent(strongest);
  }


  getAltitude() {
    if (this.parent == undefined) return null;

    let dist = p5.Vector.sub(this.pos,this.parent.pos).mag();
    return dist - this.parent.radius;

  }

  crash() {}

  setOrbit(planet, alt) {
    this.setParent(planet);

    let r = alt+planet.radius;
    let v = sqrt(planet.mass*G/r);
    this.setPos(createVector(r + planet.pos.x, planet.pos.y));
    this.setVel(createVector(0,-v));
  }

  setPos(vec) {
    this.pos = vec.copy();
  }
  getPos() {
    return this.pos;
  }

  setVel(vec) {
    this.vel = vec.copy();
  }
  getVel() {
    return this.vel;
  }

  setParent(p) {
    if (this.parent != undefined) {
      let index = this.parent.children.indexOf(this);
      if(index !== -1)
        this.parent.children.splice(index, 1);
    }

    this.parent = p;
    p.appendChild(this);

  }

  appendChild(body) {
    this.children.push(body);
  }


}
