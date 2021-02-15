const SIZE = 300;
const V0 = 5;
const R0 = 300;
const B0 = 1;
const DT = 0.1;
const Tl = 1000;


let p;


function setup() {
  createCanvas(600,600,WEBGL);


  p = {
    "trace" : [],
    "q" : 0.001,
    "m" : 0.001,
    "pos" : createVector(0, 100, 0),
    "vel" : createVector(0, 20, -10),
  }


}



function draw() {
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

  beginShape();
  for (i of p.trace)
    vertex(i.x, i.y, i.z);
  endShape();

  point(p.pos);

}



function update(p) {


  //apply B force
  const v0 = p.vel.mag();
  const Fb = createVector(p.vel.y,-p.vel.x,0);
  p.vel.add(Fb.mult(p.q*DT/p.m));
  p.vel.setMag(v0);


  //apply E force
  const Fe = createVector(-p.pos.x*p.pos.x, -p.pos.y*p.pos.y, 2*p.pos.z*p.pos.z);
  //p.vel.add(Fe.mult(p.q*V0*DT/(R0*R0*p.m)));
  p.vel.add(Fe.mult(p.q*DT*V0/(p.m*R0*R0)));


  p.pos.add(p5.Vector.mult(p.vel, DT));

  p.trace.unshift(p.pos.copy());
  if (p.trace.length > Tl) p.trace.pop();
}
