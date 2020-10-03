function trackTo(vec) {
  resetMatrix();
  translate(width/2 - vec.x, height/2 - vec.y);
}

function showFPS() {

  let avg = 0;
  for (let i = 0; i < fpsBuffer.length; i++) avg += fpsBuffer[i];
  avg /= fpsBuffer.length;


  fill(255);
  noStroke();
  textSize(18);
  textAlign(RIGHT,BOTTOM);
  text("fps:"+avg.toFixed(1),width,height-35);
}

function displayShip(body,scale = 20) {
  push();
  translate(body.pos.x,body.pos.y);
  rotate(body.rot);
  triangle(-0.5*scale, -0.5*scale, -0.5*scale, 0.5*scale, scale, 0);

  if (body.isThrusting) {
    line(-0.5*scale,0,-1.25*scale,0);
    line(-0.5*scale,0,-1*scale,-0.25*scale);
    line(-0.5*scale,0,-1*scale,0.25*scale);
  }

  pop();
}

function displayPlanet(body) {
  stroke(255);
  noFill();

  push();
  rotate(body.rot);
  circle(body.pos.x,body.pos.y,body.radius*2);
  pop();

  fill(255);
  textSize(20);
  textAlign(CENTER,CENTER);
  noStroke();
  text(body.name,body.pos.x,body.pos.y);
}

function showPrediction(body,dt = 10, epochs = 200) {

  let preview = new Body();
  preview.setPos(body.pos);
  preview.setVel(body.vel);
  preview.parent = body.parent;
  //on n'utilise pas set pour ne pas rajouter des children comme c'est juste temporaire
  // --> la preview n'affecte pas les parents de toute façon

  noFill();
  stroke(255);
  beginShape();

  for (let i = 0; i < epochs; i++) {

    let strongest = preview.getStrongest(currentSystem.planets);
    if (strongest != preview.parent && strongest != body) {

      preview.parent = strongest;

    }

    preview.applyGravity(dt = dt);
    preview.updatePos(dt = dt);

    vertex(preview.pos.x,preview.pos.y);
  }
  endShape();

}


function showArrow(body,target,lenght=100) {

    let dist = p5.Vector.sub(playerShip.pos,body.pos);


    let dx = dist.x;
    let dy = dist.y;

    if (dy > height/2 || dy < height/2) {
      let dy2 = constrain(dy,-height/2,height/2);
      dx = dx*dy2/dy
      dy = dy2;
    }
    if (dx > width/2 || dx < width/2) {
      let dx2 = constrain(dx,-width/2,width/2);
      dy = dy*dx2/dx
      dx = dx2;
    }


    let dir = dist.copy().limit(lenght);

    push();
    translate(playerShip.pos.x - dx,playerShip.pos.y - dy);
    line(0,0,dir.x,dir.y);

    //info
    push();
    noStroke();
    textAlign(CENTER,CENTER);
    translate(2*dir.x,2*dir.y);

    let txt = body.name + "\n"
       + dist.mag().toFixed(2) + "px\n"
       + (abs(body.vel.mag() - playerShip.vel.mag())*60).toFixed(2)  + "px/s\n";

    text(txt,0,0);
    pop();

    //tête
    rotate(dir.heading() - QUARTER_PI);
    line(0,0,lenght*0.2,0);
    line(0,0,0,lenght*0.2);
    pop();



}

function crosshair(x,y,r) {
  push();
  translate(x,y);
  noFill();
  line(-r,0,r,0);
  line(0,-r,0,r);
  circle(0,0,1.25*r);
  pop();
}
