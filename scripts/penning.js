const SIZE = 300;
const V0 = 5;
const R0 = 1000;
const B0 = 0.5;
const DT = 0.0001;
const Tl = 100;
const EPCS = 500;


let p;


function setup() {
  createCanvas(600,600,WEBGL);


  p = {
    "trace" : [],
    "q" : 0.001,
    "m" : 0.0001,
    "pos" : createVector(0, 0, 0),
    "vel" : createVector(0, 0, -10),
  }


}



function draw() {

  for (let i = 0; i < EPCS; i++)
    update(p);

  orbitControl();
  background(58);
  noFill();

  show(p);

  stroke(255);
  strokeWeight(2);
  box(SIZE);

}


function show(p) {
  stroke(255,0,0);
  strokeWeight(1);
  beginShape();
  for (i of p.trace)
    vertex(i.x, i.y, i.z);
  endShape();

  strokeWeight(3);
  stroke(0,255,0);
  point(p.pos);

  p.trace.unshift(p.pos.copy());
  if (p.trace.length > Tl) p.trace.pop();

}



function update(p) {


  //apply B force
  const v0 = p.vel.mag();
  const Fb = createVector(p.vel.y,-p.vel.x,0);
  p.vel.add(Fb.mult(B0*p.q*DT/p.m));
  p.vel.setMag(v0);


  //apply E force
  const Fe = createVector(-p.pos.x*p.pos.x, -p.pos.y*p.pos.y, 2*p.pos.z*p.pos.z);

  p.vel.add(Fe.mult(p.q*DT*V0/(p.m*R0*R0)));


  p.pos.add(p5.Vector.mult(p.vel, DT));

}
