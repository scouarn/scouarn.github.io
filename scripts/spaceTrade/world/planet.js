
class Planet extends MajorBody {
  constructor(parent,index) {
    super();

    this.dist = (index + 1) * 10 * parent.radius;

    this.radius = sqrt(parent.radius);
    this.mass = this.radius;

  }


}
