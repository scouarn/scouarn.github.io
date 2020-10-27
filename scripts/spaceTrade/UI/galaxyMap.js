
class State_game_galaxy extends State_game {
  constructor() {
    super();

    this.jumpButton = new Button(width-110,45,100,100,()=>{
      currentSystem = this.targetSys;
      currentSystem.appendChild(playerShip);
      playerShip.parentSystemId = this.targetSys.id;
      playerShip.setOrbit(currentSystem.majorBodies[1], 100);
      playerShip.cargo.fuel -= round((p5.Vector.sub(currentGalaxy.coords[playerShip.ftlTargetId],this.systemPos).mag()*currentGalaxy.lyRadius));
      playerShip.ftlTargetId = currentSystem.id;
      playerShip.autopilot.setTarget(playerShip.parent);

      gameState = new State_game_galaxy();
    },"JUMP");
    this.jumpButton.active = playerShip.ftlTargetId != playerShip.parentSystemId;
    this.appendButton(this.jumpButton);


    this.radius = min(width/4,height/2)*0.75;
    this.systemPos = currentGalaxy.coords[currentSystem.id];
    this.lyScanRadius = 75;
    this.inRangeSystems = [];
    this.inRangeScreenCoords = [];
    for (let i = 0; i < currentGalaxy.population; i++) {
      let vec = currentGalaxy.coords[i];
      let dist = p5.Vector.sub(vec,this.systemPos).mult(this.radius * currentGalaxy.lyRadius / this.lyScanRadius);

      if (dist.mag() < this.radius) {
        let sys = new SolarSystem(currentGalaxy,i);

        this.inRangeSystems.push(sys);
        this.inRangeScreenCoords.push(dist);

        if (i == playerShip.ftlTargetId)
            this.targetSys = sys;
      }
    }
  }

  draw() {
    background(0);


    //full galaxy
    push();
      translate(floor(width*0.25),floor(height*0.3)+17);
      scale(1,0.5);

      stroke(0,255,0);
      strokeWeight(1);
      noFill();
      line(-this.radius-50,0,this.radius+50,0);
      line(0,-this.radius-50,0,this.radius+50);


      for (let i = 1; i < 5; i++)
        circle(0,0,this.radius*i/2);


      fill(255,128,0,128);
      noStroke()
      circle(this.systemPos.x * this.radius, this.systemPos.y * this.radius,2*this.radius*this.lyScanRadius/currentGalaxy.lyRadius);

      strokeWeight(2);
      stroke(255,255,0);
      noFill();
      crosshair(this.systemPos.x * this.radius, this.systemPos.y * this.radius,40);


      stroke(255);
      strokeWeight(4);
      beginShape(POINTS);
      for (let vec of currentGalaxy.coords)
        vertex(vec.x*this.radius,vec.y*this.radius);
      endShape();

    pop();


    //system
    push();
      let starWidth = (width*0.5)/6;

      translate(starWidth*0.75,height*0.75);

      noStroke();
      fill(this.targetSys.star.col);
      starShape(0,0,starWidth,starWidth*0.9,16);

      translate(starWidth*0.5,0);
      for (let p of this.targetSys.star.majorBodies) {
        translate(starWidth*0.5,0);
        fill(0,0,255)
        circle(0,0,starWidth*0.5);

        push();
        translate(0,starWidth*0.25);
        for (let m of p.majorBodies) {
          translate(0,starWidth*0.25);
          fill(51);
          circle(0,0,starWidth*0.25);
          translate(0,starWidth*0.125);
        }

        pop();
        translate(starWidth*0.25,0);
      }

    pop();

    //zoom
    push();
      translate(floor(width*0.75),floor(height/2));

      stroke(0,255,0);
      strokeWeight(1);
      noFill();

      circle(0,0,this.radius*2);


      strokeWeight(2);
      stroke(255,255,0);
      crosshair(0,0,40);


      for (let i = 0; i < this.inRangeSystems.length; i++) {
        let vec = this.inRangeScreenCoords[i];
        let sys = this.inRangeSystems[i];

        stroke(sys.star.col);
        strokeWeight(sys.star.size);
        point(vec.x,vec.y);

        if (this.inRangeSystems[i].id == playerShip.ftlTargetId) {
          stroke(255,128,0);
          strokeWeight(2)
          crosshair(vec.x,vec.y,20);
        }
      }

    pop();


    stroke(255);
    strokeWeight(1);
    line(width/2,35,width/2,height);
    line(0,height*0.6,width/2,height*0.6);

    noStroke();
    fill(255);
    textSize(20);
    textStyle(NORMAL);

    textAlign(LEFT,TOP);

    text("Full disk"
       + "\n" + currentGalaxy.lyRadius + " ly radius"
       + "\n" + currentGalaxy.population + " stars",10,45);

    text("Target system close-up : " ,10,height*0.6+10);

    text("Zoom (in range stars)"
       + "\n" + this.lyScanRadius + " ly radius"
       + "\n" + this.inRangeSystems.length + " stars"
       ,width/2 +10,45);

    textAlign(LEFT,BOTTOM);

    text("Selected star : " + this.targetSys.worldName
       + "\nDistance : " + (p5.Vector.sub(currentGalaxy.coords[playerShip.ftlTargetId],this.systemPos).mag()*currentGalaxy.lyRadius).toFixed(1) + " ly"
       + "\n" + this.targetSys.star.desc
       ,width/2 +10,height-10);


    showFPS();
    this.showButtons();
  }

  mouseClicked() {
    if (mouseX < width/2) { //full disk



    }
    else { //select target

      let mx = mouseX - floor(width*0.75);
      let my = mouseY - floor(height*0.5);

      let recordId;
      let recordDist;

      for (let i = 0; i < this.inRangeSystems.length; i++) {

        let vec = this.inRangeScreenCoords[i];
        let d = dist(mx,my,vec.x,vec.y);

        if ((recordId == undefined || d < recordDist) && d < 20) {
          recordId = i;
          recordDist = d;
        }
      }

      if (recordId != undefined) {
        playerShip.ftlTargetId = this.inRangeSystems[recordId].id;
        this.targetSys = this.inRangeSystems[recordId];
        this.jumpButton.active = playerShip.ftlTargetId != playerShip.parentSystemId;
      }


    }

  }

}

function starShape(x,y,d1,d2,n) {
    push();
    translate(x,y);
    beginShape();

    let r1 = d1/2;
    let r2 = d2/2;
    let inc = PI / n ;
    for (let a = 0; a < TWO_PI; a+= inc*2) {
      vertex(r1*Math.cos(a),r1*Math.sin(a));
      vertex(r2*Math.cos(a+inc),r2*Math.sin(a+inc));
    }

    endShape(CLOSE);
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
