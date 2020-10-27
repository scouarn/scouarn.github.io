
class State_animation extends State {
  constructor(duration) {
    super();

    this.lastState = gameState;
    this.start = frameCount;
    this.duration = duration;
  }

  draw() {
    content();
    if (frameCount >= this.start + this.duration)
      gameState = this.lastState;
  }
  content() {}

}
