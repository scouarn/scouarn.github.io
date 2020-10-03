const MODES = [TXT256,COL256,COL16,COL4,COL2];

let screenReady = true;
let MODE = MODES[1];
let palette = 0;

let baseWidth;

let C64Font;

function preload() {
  C64Font = loadFont('/fonts/CommodorePixelizedV1.2.ttf');

}

function screenHandler(val) {

  if ((val & 128) >> 7) MODE = TXT256;
  else MODE = MODES[((val & 0b1100) >> 2) + 1];

  palette = (val & 0b1110000) >> 4;

  setTimeout(execCommand,0,val & 0b11); //pour ne pas faire attendre le CPU

}

function execCommand(val) {
  switch (val) { //command
    case 0: redraw(); break;
    case 1: background(0); break;
    case 2: loop(); break;
    case 3: noLoop(); break;
  }
}

function setup() {
  baseWidth = windowWidth*0.9;
  createCanvas(baseWidth,baseWidth);
  background(0);
  frameRate(10);
  noLoop();
}

function draw() {
  if (frameCount > 1) MODE();
  if (window.frameElement) window.frameElement.height = document.body.scrollHeight;
}


function TXT256() {

  let cols = 80;
  let rows = 51;
  let res = baseWidth/cols;

  textSize(res*1.25);
  textLeading(res);
  textFont(C64Font);
  textAlign(LEFT,TOP);

  let cwidth = textWidth(" ");

  resizeCanvas(cwidth*cols,res*rows +2);
  background(0);
  colorMode(RGB,255);
  noStroke();
  fill(255);
  noSmooth();


  let txt = "";
  for (y = 0; y < rows; y++) {
    for (x = 0; x < cols; x++) {
      let char = mac.mem[VRAMSTART + x+y*cols];
      if (char < 127 && char >= 32) txt += String.fromCharCode(char);
      else txt += " ";
    }
    txt += "\n"
  }

  text(txt,0,0);

}
function COL256() {
  resizeCanvas(baseWidth,baseWidth);
  background(0);
  colorMode(RGB,255);
  noStroke();

  let res = width/64;

  for (y = 0; y < 64; y++)
    for (x = 0; x < 64; x++) {
      fill(mac.mem[VRAMSTART + x+y*64]);
      rect(x*res,y*res,res,res);
    }


}
function COL16 () {
  resizeCanvas(baseWidth,baseWidth*0.5);
  background(0);
  colorMode(RGB,15);
  noStroke();

  let res = width/128;

  let i = 0;
  for (y = 0; y < 64; y++)
    for (x = 0; x < 128; x+=2) {

      let val = mac.mem[VRAMSTART + 0.5*x+y*64];

      fill((val >> 4));
      rect(x*res,y*res,res,res);
      fill((val & 0xF));
      rect((x+1)*res,y*res,res,res);
    }
}

function COL4  () {
  resizeCanvas(baseWidth,baseWidth);
  background(0);
  colorMode(RGB,3);
  noStroke();

  let res = width/128;

  for (y = 0; y < 128; y++) {
    for (x = 0; x < 128; x+=4) {

      let val = mac.mem[VRAMSTART + 0.25*x+y*32];

      fill((val & 0b11000000) >> 6);
      rect(x*res,y*res,res,res);

      fill((val & 0b00110000) >> 4);
      rect((x+1)*res,y*res,res,res);

      fill((val & 0b00001100) >> 2);
      rect((x+2)*res,y*res,res,res);

      fill((val & 0b00000011));
      rect((x+3)*res,y*res,res,res);


    }

  }

}
function COL2  () {
  resizeCanvas(baseWidth,baseWidth*0.5);
  background(0);
  colorMode(RGB,1);
  noStroke();

  let res = width/256;


  for (y = 0; y < 128; y++) {
    for (x = 0; x < 256; x+=8) {

      let val = mac.mem[VRAMSTART + 0.125*x+y*32];

      fill((val & 128) >> 7);
      rect(x*res,y*res,res,res);

      fill((val & 64) >> 6);
      rect((x+1)*res,y*res,res,res);

      fill((val & 32) >> 5);
      rect((x+2)*res,y*res,res,res);

      fill((val & 16) >> 4);
      rect((x+3)*res,y*res,res,res);

      fill((val & 8) >> 3);
      rect((x+4)*res,y*res,res,res);

      fill((val & 4) >> 2);
      rect((x+5)*res,y*res,res,res);

      fill((val & 2) >> 1);
      rect((x+6)*res,y*res,res,res);

      fill((val & 1));
      rect((x+7)*res,y*res,res,res);

    }

  }
}
