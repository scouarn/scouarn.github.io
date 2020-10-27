

class SolarSystem extends MajorBody {

  constructor(gal, id) {
    super();

    this.id = id;
    this.pos = gal.coords[id];
    this.seed = id + gal.seed;
    randomSeed(this.seed);

    this.worldName = genName();

    //star
    this.star = new Star();
    this.star.name = this.worldName;
    this.appendPlanet(this.star);

    //planets
    for (let i = 0; i < ceil(random(1,6)); i++) {
      let p = new Planet(this.star, i);

      p.name = this.star.name + " " + romans[i+1];
      this.appendPlanet(p, this.star, p.dist, random(TWO_PI));

      //moons
      for (let j = 0; j < ceil(random(-2,3)); j++) {
        let m = new Planet(p, j);
        m.name = p.name + alphabet_down[j];
        this.appendPlanet(m, p, m.dist, random(TWO_PI));
      }

    }

  }


  appendPlanet(body,parent,alt, angle = 0) {
    if (parent != undefined)
      body.setOrbit(parent, alt, angle);

    this.appendChild(body);
  }


}
