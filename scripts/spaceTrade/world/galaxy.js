class Galaxy {

  constructor(seed) {

    this.population = 300;
    this.lyRadius = 500;

    if (typeof seed == "string") {
      let string = "";
      for (let char of seed)
        string += char.charCodeAt(0);
      this.seed = Number(string);
    }
    if (Number.isInteger(seed)) {
      this.seed = seed;
    }
    else {
      console.warn("No seed given, random seed generated.");
      this.seed = window.crypto.getRandomValues(new Uint32Array(1))[0];
    }

    randomSeed(this.seed);

    this.coords = [];

    while(this.coords.length < this.population) {
      let r = random();
      let o = random(TWO_PI);
      let pos = p5.Vector.fromAngle(o).setMag(sqrt(r));

      this.coords.push(pos);
    }

  }
}
