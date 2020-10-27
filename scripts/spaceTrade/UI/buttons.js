
class Button {

  constructor(x,y,w,h,onClick = ()=>{}, label = "", active = true, hidden = false) {

    this.x = x;
    this.y = y;

    this.w = w;
    this.h = h;

    this.onClick = onClick;
    this.label = label;

    this.active = active;
    this.hidden = hidden;
  }

  isHovered() {
    return this.active && (mouseX > this.x && mouseX < this.x + this.w && mouseY > this.y && mouseY < this.y + this.h);
  }

  display() {
    if (this.hidden) return;

    stroke(255);

    rectMode(this.mode);
    rect(this.x,this.y,this.w,this.h)

    noStroke();
    if (this.active) {
      fill(255);
      textStyle(NORMAL);
    }
    else {
      fill(128);
      textStyle(ITALIC);
    }
    textAlign(CENTER,CENTER);
    text(this.label,this.x + this.w/2,this.y + this.h/2);

  }


}
