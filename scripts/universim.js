const G = 0.07;
const DT = 5;
const MIND = 10;
const MAXD = 60;
const N = 500;
const SIZE = 300;



let particles = [];

function setup() {
  createCanvas(600,600,WEBGL);

  for (i = 0; i < N; i++)
    particles.push(new particle(random()*SIZE - SIZE/2,random()*SIZE - SIZE/2,random()*SIZE - SIZE/2));

}

function draw() {
  updateSystem();

  orbitControl();
  background(0);
  stroke(255,0,0);
  strokeWeight(1);
  noFill();

  beginShape(POINTS);
  for (p of particles)
    vertex(p.px,p.py,p.pz);
  endShape();

  stroke(255);
  box(SIZE);


}

function keyPressed() {
  switch (key) {
    case " ": console.log(frameRate()); break;
  }
}

function updateSystem() {

  //update speed
  for (i = 0; i < particles.length; i++) {
    let p1 = particles[i];

    for (j = i+1; j < particles.length; j++) {
      let p2 = particles[j];

      let distVecX = p2.px - p1.px; let distVecY = p2.py - p1.py; let distVecZ = p2.pz - p1.pz;
      let distSq = max(distVecX*distVecX + distVecY*distVecY + distVecZ*distVecZ,MIND*MIND);
      if (distSq > MAXD*MAXD) continue;
      let dist = sqrt(distSq);
      let dirVecX = distVecX/dist; let dirVecY = distVecY/dist; let dirVecZ = distVecZ/dist;

      let f = G/distSq;
      p1.applyForce(f*dirVecX, f*dirVecY, f*dirVecZ);
      p2.applyForce(-f*dirVecX,-f*dirVecY,-f*dirVecZ);

    }
  }

  //update pos
  for (p of particles) {
    p.updatePos();
  }


}


function particle(x,y,z) {
  this.px = x; this.py = y; this.pz = z;
  this.vx = 0; this.vy = 0; this.vz = 0;
}

particle.prototype.applyFriction = function(f) {
  this.vx *= f*DT; this.vy *= f*DT; this.vz *= f*DT;
};

particle.prototype.applyForce = function(x,y,z) {
  this.vx += x*DT; this.vy += y*DT; this.vz += z*DT;
};

particle.prototype.updatePos = function () {
  this.px += this.vx*DT; this.py += this.vy*DT; this.pz += this.vz*DT;
};
