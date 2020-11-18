


function setup() {

  createCanvas(600,600);
  noLoop();
  colorMode(HSB);

}

function draw() {
  loadPixels();

  const xMax = 1;
  const xMin = -2;
  const yMax = 1.5;
  const yMin = -1.5;

  const dx = (xMax - xMin) / (width);
  const dy = (yMax - yMin) / (height);


  const maxIter = 300;


  let x = xMin;
  for (let i = 0; i < width; i++) {

    let y = yMin;
    for (let j = 0; j < height; j++) {

      let zx = x;
      let zy = y;
      let n = 0;

      while (n < maxIter && zx*zx + zy*zy < 4) {

        t  = zx*zx - zy*zy + x;
        zy = 2*zx*zy + y;
        zx = t;
        n++;

      }

      let h = map(sqrt(n),0,sqrt(maxIter),0,360);
      let s = 100;
      let b = 100*(n!=maxIter);

      set(i,j,color(h,s,b))

      y += dy

    }
    x += dx
  }


  updatePixels();
}
