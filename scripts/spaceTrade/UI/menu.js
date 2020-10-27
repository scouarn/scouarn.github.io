
class State_mainMenu extends State {


  constructor() {
    super();

    this.stars = [];
    for (let i = 0; i < 250; i ++) {
      this.stars.push({'x':random(width), 'y':random(height),'s':random(Math.cbrt(5))});
    }

    this.continueButton = new Button(width/2-150,height/2-140,300,60,()=>{
      if (currentGalaxy == undefined)
          loadSave();

      gameState = new State_game_orbitMap();
    },"CONTINUE",thereIsASave() || currentGalaxy != undefined);
    this.appendButton(this.continueButton);

    this.appendButton(new Button(width/2-150,height/2-70,300,60,()=>{
      newGame();
      gameState = new State_game_orbitMap();
    },"NEW GAME"));

    this.appendButton(new Button(width/2-150,height/2,300,60, ()=>{
      resizeCanvas(window.innerWidth,window.innerHeight);
      gameState = new State_mainMenu();
    },"RESIZE CANVAS"));

    this.eraseButton = new Button(width/2-150,height/2+100,300,60, ()=>{
      eraseSave();
      this.eraseButton.active = false;
      this.continueButton.active = false;
    },"ERASE SAVE", thereIsASave());
    this.appendButton(this.eraseButton);
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
    text("Proto version 2\nScouarn, 2020",10,10);

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


    this.appendButton(new Button(width/2-150,height/2-70,300,60,()=>{
      saveGame();
      this.reloadButton.active = true;
    },"SAVE"));

    this.reloadButton = new Button(width/2-150,height/2,300,60, ()=>{
      loadSave();
    },"RELOAD", thereIsASave());
    this.appendButton(this.reloadButton);

    this.appendButton(new Button(width/2-150,height/2+100,300,60, ()=>{
      gameState = new State_mainMenu();
    },"MAIN MENU"));

  }

  draw() {
    this.lastState.draw();

    fill(0);
    stroke(255);
    strokeWeight(1);
    rect(width/2-170,height/2-220,340,400);

    textStyle(NORMAL);
    textSize(72);
    fill(255);
    noStroke();
    textAlign(CENTER,TOP);
    text("MENU",width/2,height/2-210);

    textSize(32);
    this.showButtons();
  }
}
