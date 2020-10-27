
class MajorBody extends Body {
  constructor() {
    super();

    this.majorBodies = [];
    this.allChildren = [];
    this.otherBodies = [];

  }


  updatePos(dt = 1) {
    this.moveRecursively(p5.Vector.mult(this.vel,dt));
    this.rot += this.rotSpeed*dt;
  }

  moveRecursively(vec) {
    this.pos.add(vec);

    for (let b of this.majorBodies)
      b.moveRecursively(vec);

    for (let b of this.otherBodies)
      b.pos.add(vec);
  }

  appendChild(body) {
    if (body instanceof MajorBody)
        this.majorBodies.push(body);
      else
        this.otherBodies.push(body);

    this.allChildren.push(body);
  }

  removeChild(body) {

    let i = this.majorBodies.indexOf(body);
    if(i !== -1) this.majorBodies.splice(i, 1);

    let j = this.otherBodies.indexOf(body);
    if(j !== -1) this.otherBodies.splice(j, 1);

    let k = this.allChildren.indexOf(body);
    if(k !== -1) this.allChildren.splice(k, 1);

  }

  update() {

    for (let child of this.allChildren) {
      child.applyGravity();
    }

    for (let child of this.allChildren) {
      child.updatePos();
    }
  }



}
