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
    mouseWheel() {}

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

class State_game_system extends State_game {

}


class State_game_ship extends State_game {

}

class State_game_trading extends State_game {

}

class State_game_jobs extends State_game {

}
