

class Ship extends Body {
  constructor(mass = 1, name = "ship") {
    super(mass,name);
    this.isThrusting = false;
    this.thrust = 0.01;
    this.autopilot = new Autopilot(this);

    this.ftlTargetId = 0;

    this.cargo = {
      "fuel":75
    };
  }


  updateSystems() {
    this.autopilot.update();
  }

  applyControls() {

    if (keyIsDown(LEFT_ARROW)) {
      this.rot -= 0.05;
      this.autopilot.setMode(APModes.OFF);
    }
    else if (keyIsDown(RIGHT_ARROW)) {
      this.rot += 0.05;
      this.autopilot.setMode(APModes.OFF);
    }

    if (keyIsDown(UP_ARROW)) {
      let force = p5.Vector.fromAngle(this.rot).mult(this.thrust);
      this.applyForce(force);
      this.isThrusting = true;
    }
    else this.isThrusting = false;

  }

  ftlJump(dumSys) {
    console.log("FTL!");
    //currentSystem = dumSys.promote();
  }

}
