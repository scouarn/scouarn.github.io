const G = 0.05;
const N = 2000;
const DT = 1;
const R = 500;
const D = 10;

let star;

let particles = [];

function setup() {
  createCanvas(600,600);

  star = new particle(0,0);
  star.mass = 1000;
  particles.push(star);

  for (i = 0; i < N; i++) {
    let a = random(TAU);
    let r = max(star.radius(),random(R));
    let p = new particle(r*cos(a),r*sin(a));
    vel = sqrt(G*(star.mass+N*0.2)/r);
    p.vx = sin(a)*vel; p.vy = -cos(a)*vel;

    particles.push(p);

  }
  //
  // let p1 = new particle(200,height/2);
  // let p2 = new particle(width-200,height/2);
  // p1.mass = 100;
  // p2.mass = 50;
  // particles.push(p1);
  // particles.push(p2);

}

function draw() {
  updateSystem();

  background(0);
  stroke(255,0,0);

  push();
  //translate(width/2 - star.px,height/2 - star.py);
  translate(width/2,height/2);

  noFill();

  for (p of particles) {
    strokeWeight(p.radius()*2);
    point(p.px,p.py);
  }

  pop();

  noStroke();
  fill(255);
  text("fps : "+10*floor(frameRate())/10,10,15);
  text("n : "+ particles.length,10,30);


}



function updateSystem() {

  //update speed
  for (i = 0; i < particles.length; i++) {
    let p1 = particles[i];

    for (j = i+1; j < particles.length; j++) {
      let p2 = particles[j];

      let distVecX = p2.px - p1.px; let distVecY = p2.py - p1.py;
      let distSq = distVecX*distVecX + distVecY*distVecY;
      let dist = sqrt(distSq);

      if (dist < p1.radius()+p2.radius()) { //collision
        merge(p1,p2);
        continue;
      }

      let dirVecX = distVecX/dist; let dirVecY = distVecY/dist;

      let f = (G*p1.mass*p2.mass)/distSq;
      p1.applyForce(f*dirVecX, f*dirVecY);
      p2.applyForce(-f*dirVecX,-f*dirVecY);

    }
  }

  //update pos
  for (p of particles) {
    p.updatePos();
  }


}


function particle(x,y) {
  this.px = x; this.py = y;
  this.vx = 0; this.vy = 0;
  this.mass = 1;
}

particle.prototype.radius = function() {
  return sqrt(this.mass/(PI*D));
};

particle.prototype.applyForce = function(x,y) {
  this.vx += x*DT/this.mass; this.vy += y*DT/this.mass;
};

particle.prototype.updatePos = function () {
  this.px += this.vx*DT; this.py += this.vy*DT;
};

function merge(p1,p2) {
  let vx = (p1.mass*p1.vx + p2.mass*p2.vx)/(p1.mass+p2.mass); //conservation de la quantité de matière
  let vy = (p1.mass*p1.vy + p2.mass*p2.vy)/(p1.mass+p2.mass);

  p1.vx = vx; p1.vy = vy;
  p1.mass += p2.mass;

  let i = particles.indexOf(p2);
  particles.splice(i, 1);

}
