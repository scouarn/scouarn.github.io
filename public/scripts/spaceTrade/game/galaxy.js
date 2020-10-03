class Galaxy {

  constructor(seed) {

    this.population = 250;
    this.lyRadius = 500;

    if (seed == undefined || (typeof seed != "string")) {
      console.warn("No seed given, random seed generated.");
      this.seed = window.crypto.getRandomValues(new Uint32Array(1))[0];
    }
    else {
      let string = "";
      for (let char of seed)
        string += char.charCodeAt(0);
      this.seed = Number(string);
    }
    randomSeed(this.seed);

    this.coords = [];

    for (let i = 0; i < this.population; i++) {
      let r = random();
      let o = random(TWO_PI);
      let pos = p5.Vector.fromAngle(o).setMag(sqrt(r));

      this.coords.push(pos);
    }

  }


}
