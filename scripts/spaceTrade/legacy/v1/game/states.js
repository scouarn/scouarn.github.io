class State {

    constructor() {
      this.buttons = [];
    }

    showButtons() {
      document.body.style.cursor = "crosshair";

      for (let b of this.buttons) {
        if (b.isHovered()) {
          strokeWeight(3);
          document.body.style.cursor = "pointer";
        }
        else
          strokeWeight(1);

        fill(0,200);
        b.display();
      }
    }
    testButtons() {
      for (let b of this.buttons)
        if (b.isHovered())
          b.onClick();
    }
    appendButton(b) {
      this.buttons.push(b);
    }

    draw() {}
    mouseClicked() {}
    keyPressed() {}

}

class State_mainMenu extends State {


  constructor() {
    super();

    this.stars = [];
    for (let i = 0; i < 250; i ++) {
      this.stars.push({'x':random(width), 'y':random(height),'s':random(Math.cbrt(5))});
    }

    this.appendButton(new Button(width/2-150,height/2-140,300,60,()=>{
      gameState = new State_game_orbitMap();
    },"PLAY"));


    this.appendButton(new Button(width/2-150,height/2-70,300,60,()=>{},"SAVE",false));
    this.appendButton(new Button(width/2-150,height/2,300,60, ()=>{
      resizeCanvas(window.innerWidth,window.innerHeight);
      gameState = new State_mainMenu();
    },"RESIZE CANVAS"));

    this.appendButton(new Button(width/2-150,height/2+100,300,60, ()=>{},"ERASE SAVE",false));
  }


  draw() {
    background(0);
    // colorMode(HSL);
    // for (let y = 0; y < height; y++) {
    //   stroke(244,75,100*(y)/height,0.3);
    //   line(0, y, width, y);
    // }
    // colorMode(RGB);

    textFont('Courier');
    textStyle(NORMAL);
    fill(255);

    stroke(255);
    for (let star of this.stars) {
      strokeWeight(star.s*star.s*star.s);
      point(star.x,star.y);
    }

    noStroke();
    textAlign(CENTER,CENTER);
    textSize(72);
    text("PLACEHOLDER",width/2,height*0.2)

    textSize(20);
    stroke(0);
    strokeWeight(5);
    textAlign(LEFT,TOP);
    text("Version 1\nScouarn, 2020",10,10);

    textSize(32);
    this.showButtons();

  }


}

class State_inGameMenu extends State {
  constructor(last = gameState) {
    super();

    this.lastState = last;



    this.appendButton(new Button(width/2-150,height/2-140,300,60,()=>{
      gameState = this.lastState;
    },"CONTINUE"));


    this.appendButton(new Button(width/2-150,height/2-70,300,60,()=>{},"SAVE",false));
    this.appendButton(new Button(width/2-150,height/2,300,60, ()=>{
      resizeCanvas(window.innerWidth,window.innerHeight);
      this.lastState.draw();
      gameState = new State_inGameMenu(this.lastState.super());
    },"RESIZE CANVAS",false));
    this.appendButton(new Button(width/2-150,height/2+100,300,60, ()=>{
      gameState = new State_mainMenu();
    },"MAIN MENU"));

  }

  draw() {

    fill(0);
    stroke(255);
    strokeWeight(1);
    rect(width/2-170,height/2-220,340,400);

    textStyle(NORMAL);
    textSize(72);
    fill(255);
    noStroke();
    textAlign(CENTER,TOP);
    text("PAUSED",width/2,height/2-210);

    textSize(32);
    this.showButtons();
  }
}

class State_game extends State {
  constructor() {
    super();


    let bW = width/7;
    this.appendButton(new Button(0*bW,0,bW,35,()=>{
      gameState = new State_game_closeUp();
    },"Close-up",false));
    this.appendButton(new Button(1*bW,0,bW,35,()=>{
      gameState = new State_game_orbitMap();
    },"Orbit"));
    this.appendButton(new Button(2*bW,0,bW,35,()=>{
      gameState = new State_game_system();
    },"Solar Sys.",false));
    this.appendButton(new Button(3*bW,0,bW,35,()=>{
      gameState = new State_game_galaxy();
    },"Galaxy"));
    this.appendButton(new Button(4*bW,0,bW,35,()=>{
      gameState = new State_game_ship();
    },"Ship",false));
    this.appendButton(new Button(5*bW,0,bW,35,()=>{
      gameState = new State_game_trading();
    },"Trading",false));
    this.appendButton(new Button(6*bW,0,bW,35,()=>{
      gameState = new State_game_jobs();
    },"Jobs",false));

    this.appendButton(new Button(width-bW,height-35,bW,35,()=>{
      gameState = new State_inGameMenu();
    },"Menu"));

  }

  draw() {
    background(0);
    textSize(100);
    textAlign(CENTER,CENTER);
    text("W.I.P",width/2,height/2);
    showFPS();
    this.showButtons();
  }
}


class State_game_closeUp extends State_game {

}

class State_game_orbitMap extends State_game {
  constructor() {
    super();


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

    currentSystem.updateChildren();

    playerShip.applyControls();
    playerShip.updateParent();
    playerShip.updateSystems();



    background(0);
    textFont('Courier');

    noFill();
    stroke(255);
    strokeWeight(1);
    trackTo(playerShip.pos);

    displayShip(playerShip);
    showPrediction(playerShip);

    for (let p of currentSystem.planets) {
      displayPlanet(p);
    }

    showPrediction(playerShip.autopilot.target);

    textSize(20);
    stroke(0,255,0);
    fill(0,255,0);
    showArrow(playerShip.autopilot.target);


    resetMatrix();

    showFPS();
    textAlign(LEFT,BOTTOM);
    text(playerShip.autopilot.getModeName(),30,height-290);
    this.showButtons();
  }


}

class State_game_system extends State_game {

}

class State_game_galaxy extends State_game {
  constructor() {
    super();

    this.jumpButton = new Button(width-110,45,100,100,()=>{
      playerShip.ftlJump(this.targetSys);
    },"JUMP");
    this.jumpButton.active = false;
    this.appendButton(this.jumpButton);


    this.radius = min(width/4,height/2)*0.75;

    this.systemPos = currentGalaxy.coords[currentSystem.info.id];
    this.targetSys = new DummySystem(currentSystem.info.id,currentGalaxy.coords[currentSystem.info.id]);

    this.lyTravelRadius = playerShip.cargo.fuel;
    this. pxTravelRadius =  this.radius * currentGalaxy.lyRadius / this.lyTravelRadius;

    this.inRange = [];
    this.inRangeScreenCoords = [];
    for (let i = 0; i < currentGalaxy.population; i++) {
      let vec = currentGalaxy.coords[i];
      let dist = p5.Vector.sub(vec,this.systemPos).mult(this.pxTravelRadius);

      if (dist.mag() < this.radius) {
        this.inRange.push(i);
        this.inRangeScreenCoords.push(dist);
      }
    }

  }

  draw() {
    background(0);

    push();
    translate(0,floor(height/2));

    //full galaxy
    push();
    translate(floor(width*0.25),0);

    stroke(0,255,0);
    strokeWeight(1);
    noFill();
    line(-this.radius-50,0,this.radius+50,0);
    line(0,-this.radius-50,0,this.radius+50);


    for (let i = 1; i < 5; i++)
      circle(0,0,this.radius*i/2);




    fill(255,128,0,128);
    noStroke()
    circle(this.systemPos.x * this.radius, this.systemPos.y * this.radius,2*this.radius*this.lyTravelRadius/currentGalaxy.lyRadius);

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


    push();
    translate(floor(width*0.75),0);

    stroke(0,255,0);
    strokeWeight(1);
    noFill();

    circle(0,0,this.radius*2);


    strokeWeight(2);
    stroke(255,255,0);
    crosshair(0,0,40);


    for (let i = 0; i < this.inRange.length; i++) {
      let vec = this.inRangeScreenCoords[i];
      stroke(255);
      strokeWeight(10);
      point(vec.x,vec.y);

      if (this.inRange[i] == playerShip.ftlTargetId) {
        stroke(255,128,0);
        strokeWeight(2)
        crosshair(vec.x,vec.y,20);
      }
    }



    pop();

    pop();


    stroke(255);
    strokeWeight(1);
    line(width/2,35,width/2,height);

    noStroke();
    fill(255);
    textStyle(NORMAL);
    textAlign(LEFT,TOP);
    text("Full disk"
       + "\n" + currentGalaxy.lyRadius + " ly radius"
       + "\n" + currentGalaxy.population + " stars",10,45);

    text("Zoom (in range stars)"
       + "\n" + this.lyTravelRadius + " ly radius"
       + "\n" + this.inRange.length + " stars",width/2 +10,45);

    textAlign(LEFT,BOTTOM);

    text("Selected star : " + this.targetSys.beaconName
       + "\nDistance : " + (p5.Vector.sub(currentGalaxy.coords[playerShip.ftlTargetId],this.systemPos).mag()*currentGalaxy.lyRadius).toFixed(1) + " ly"
       + "\nTest",width/2 +10,height-10);

    showFPS();
    this.showButtons();
  }

  mouseClicked() {
    if (mouseX < width/2) { //full disk



    }
    else { //select target

      let mx = mouseX - floor(width*0.75);
      let my = mouseY - floor(height*0.5);

      let recordId = playerShip.ftlTargetId;
      let recordDist;

      for (let i = 0; i < this.inRange.length; i++) {

        let vec = this.inRangeScreenCoords[i];
        let d = dist(mx,my,vec.x,vec.y)

        if ((recordDist == undefined || d < recordDist) && d < 20) {
          recordId = this.inRange[i];
          recordDist = d;
        }
      }
      playerShip.ftlTargetId = recordId;
      this.targetSys = new DummySystem(recordId,currentGalaxy.coords[recordId]);

      if (recordId != currentSystem.info.id) this.jumpButton.active = true;
      else this.jumpButton.active = false;
    }

  }

}

class State_game_ship extends State_game {

}

class State_game_trading extends State_game {

}

class State_game_jobs extends State_game {

}

class State_animation extends State {
  constructor() {
    super();
  }

}
