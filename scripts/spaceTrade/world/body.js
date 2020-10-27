const G = 10;

class Body {
  constructor() {
    this.pos = createVector(0,0);
    this.vel = createVector(0,0);
    this.mass = 1;
    this.rot = 0;
    this.rotSpeed = 0;
    this.name = "body";
    this.parent;
    this.parentSystemId;
  }

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
    this.pos.add(p5.Vector.mult(this.vel,dt));
    this.rot += this.rotSpeed*dt;
  }
  applyGravity(dt = 1) {
    if (this.parent != undefined)
      this.vel.add(this.getForceFromParent(this.parent).mult(dt));
  }

  getNearest(list) {
    let record;
    let recordDistSq;

    for (let body of list) {
      let distSq = p5.Vector.sub(body.pos,this.pos).magSq();
      if (body != this && (recordDistSq == undefined || distSq < recordDistSq)) {
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

  getAltitude() {
    if (this.parent == undefined) return null;

    let dist = p5.Vector.sub(this.pos,this.parent.pos).mag();
    return dist - this.parent.radius;

  }

  crash() {}

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

  setParent(planet) {
    if (this.parent != undefined)
      this.parent.removeChild(this);

    this.parent = planet;
    planet.appendChild(this);
  }

  setOrbit(planet, alt, angle = 0) {
    this.setParent(planet);

    let r = alt+planet.radius;
    let v = sqrt(planet.mass*G/r);
    this.setPos(createVector(r*Math.cos(angle) + planet.pos.x, r*Math.sin(angle) + planet.pos.y));
    this.setVel(createVector(v*Math.sin(angle),-v*Math.cos(angle)));
  }

  getPrediction(dt, epochs) {

    let preview = new RogueBody();
    preview.setPos(this.pos);
    preview.setVel(this.vel);
    preview.parent = this.parent;
    //on n'utilise pas setParent() pour ne pas rajouter des children comme c'est juste temporaire
    // --> la preview n'affecte pas les parents de toute façon


    let pred = [];
    pred.push(preview.pos.copy()); //il faut doubler le premier vertice
    for (let i = 0; i < epochs; i++) {
      pred.push(preview.pos.copy());
      preview.applyGravity(dt = dt);
      preview.updatePos(dt = dt);
    }
    pred.push(preview.pos.copy());

    return pred;
  }


}



class RogueBody extends Body {
  constructor() {
    super();
  }

  updateParent() {
    let strongest = this.getStrongest(currentSystem.majorBodies);
    if (strongest != this.parent)
      this.setParent(strongest);
  }
  updatePos(dt = 1) {
    this.updateParent();
    this.pos.add(p5.Vector.mult(this.vel,dt));
    this.rot += this.rotSpeed*dt;
  }

}
