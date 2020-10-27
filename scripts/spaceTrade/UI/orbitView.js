

class State_game_orbitMap extends State_game {
  constructor() {
    super();

    this.scale = 1;
    this.trackingTraget = playerShip.pos;
    this.offset = createVector(0,0);

    this.appendButton(new Button(30,height-280,50,50,()=>{
      playerShip.autopilot.setMode("OFF");
    }, APModes.OFF));
    this.appendButton(new Button(80,height-280,50,50,()=>{
      playerShip.autopilot.setMode("KIL");
    },APModes.KIL));
    this.appendButton(new Button(30,height-230,50,50,()=>{
      playerShip.autopilot.setMode("PRO");
    },APModes.PRO));
    this.appendButton(new Button(80,height-230,50,50,()=>{
      playerShip.autopilot.setMode("RET");
    },APModes.RET));
    this.appendButton(new Button(30,height-180,50,50,()=>{
      playerShip.autopilot.setMode("TOW");
    },APModes.TOW));
    this.appendButton(new Button(80,height-180,50,50,()=>{
      playerShip.autopilot.setMode("AWY");
    },APModes.AWY));
    this.appendButton(new Button(30,height-130,50,50,()=>{
      playerShip.autopilot.setMode("TGT");
    },APModes.TGT));
    this.appendButton(new Button(80,height-130,50,50,()=>{
      playerShip.autopilot.setMode("ATG");
    },APModes.ATG));
    this.appendButton(new Button(30,height-80,50,50,()=>{
      playerShip.autopilot.setMode("REL");
    },APModes.REL));
    this.appendButton(new Button(80,height-80,50,50,()=>{
      playerShip.autopilot.setMode("ARL");
    },APModes.ARL));


  }

  draw() {
    currentSystem.update();

    playerShip.applyControls();
    playerShip.updateSystems();


    background(0);
    textFont('Courier');
    textStyle(NORMAL);

    noFill();
    stroke(255);
    strokeWeight(1);

    this.displayShip(playerShip);

    stroke(128,128,256);
    this.showPrediction(playerShip);

    for (let p of currentSystem.majorBodies)
      this.displayPlanet(p);


    textSize(20);
    strokeWeight(2);

    if (playerShip.autopilot.target != undefined) {
      stroke(0,255,0);
      this.showArrow(playerShip.autopilot.target);
      this.showPrediction(playerShip.autopilot.target);

      noStroke();
      fill(0,255,0);
      textAlign(LEFT,TOP);
      text(playerShip.autopilot.target.name + "\n"
         + p5.Vector.sub(playerShip.autopilot.target.pos,playerShip.pos).mag().toFixed(2) + "px\n"
         +(p5.Vector.sub(playerShip.autopilot.target.vel,playerShip.vel).mag()*60).toFixed(2)  + "px/s\n"
         ,10,45);
    }

    let nearest = playerShip.getStrongest(currentSystem.allChildren);
    if (nearest != playerShip.autopilot.target) {
      stroke(200);
      this.showArrow(nearest);

      noStroke();
      textAlign(RIGHT,TOP);
      fill(200);
      text(nearest.name + "\n"
         + p5.Vector.sub(nearest.pos,playerShip.pos).mag().toFixed(2) + "px\n"
         +(p5.Vector.sub(nearest.vel,playerShip.vel).mag()*60).toFixed(2)  + "px/s\n"
         ,width-10,45);
    }

    showFPS();
    textAlign(LEFT,BOTTOM);
    text(playerShip.autopilot.getModeName(),30,height-290);
    this.showButtons();



    if (mouseIsPressed && mouseButton == CENTER) {
      this.trackingTraget = this.trackingTraget.copy();
      this.offset.x += movedX/this.scale;
      this.offset.y += movedY/this.scale;
    }
  }

  mouseWheel(event) {
    if (event.delta > 0)
      this.scale *= 0.8;
    else
      this.scale /= 0.8;
  }

  keyPressed() {
    if (keyCode == 8) {
      this.trackingTraget = playerShip.pos;
      this.offset.mult(0);
      this.scale = 1;
    }
  }

  toScreenX(x) {
    return width/2 + (x - this.trackingTraget.x + this.offset.x)*this.scale;
  }

  toScreenY(y) {
    return height/2 + (y - this.trackingTraget.y + this.offset.y)*this.scale;
  }

  toScreen(vec) {
    return p5.Vector.sub(vec,this.trackingTraget).add(this.offset).mult(this.scale).add(centerVec);
  }


  displayShip(body,scale = 20*sqrt(this.scale)) {
    push();
    translate(this.toScreenX(body.pos.x),this.toScreenY(body.pos.y));
    rotate(body.rot);
    triangle(-0.5*scale, -0.5*scale, -0.5*scale, 0.5*scale, scale, 0);

    if (body.isThrusting) {
      line(-0.5*scale,0,-1.25*scale,0);
      line(-0.5*scale,0,-1*scale,-0.25*scale);
      line(-0.5*scale,0,-1*scale,0.25*scale);
    }

    pop();
  }

  displayPlanet(body) {
    noFill();

    if (body.parent != undefined) {
      strokeWeight(1);
      stroke(128);
      circle(this.toScreenX(body.parent.pos.x),this.toScreenY(body.parent.pos.y),(body.dist + body.parent.radius)*2*this.scale);
    }

    push();
    rotate(body.rot);
    strokeWeight(2);
    stroke(255);
    translate(this.toScreenX(body.pos.x),this.toScreenY(body.pos.y))

    circle(0,0,body.radius*2*this.scale);

    if (body.parent == undefined || p5.Vector.sub(this.toScreen(body.pos),this.toScreen(body.parent.pos)).mag() > 50) {
      fill(255);
      textSize(20);
      textAlign(CENTER,CENTER);
      noStroke();
      text(body.name,0,0);
    }

    pop();
  }

  showPrediction(body) {
    if (body instanceof MajorBody) return;

    noFill();
    beginShape();
    curveVertex(playerShip.pos,playerShip.pos);
    for (let vec of body.getPrediction(10,150))
      curveVertex(this.toScreenX(vec.x),this.toScreenY(vec.y));
    endShape();

  }


  showArrow(body,length=200) {
    noFill();

    let dist = p5.Vector.sub(centerVec,this.toScreen(body.pos));
    if (dist.mag() < length*0.1) return;

    let dx = dist.x;
    let dy = dist.y;

    if (dy > height/2 || dy < height/2) {
      let dy2 = constrain(dy,50 -height/2,height/2 - 50);
      dx = dx*dy2/dy
      dy = dy2;
    }
    if (dx > width/2 || dx < width/2) {
      let dx2 = constrain(dx,50 - width/2,width/2 - 50);
      dy = dy*dx2/dx
      dx = dx2;
    }

    push();
    translate(width/2 - dx, height/2 - dy);
    rotate(dist.heading());
    line(0,0,min(length,dist.mag()),0);
    rotate(- QUARTER_PI);
    line(0,0,length*0.1,0);
    line(0,0,0,length*0.1);
    pop();

  }
}
