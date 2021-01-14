let cols;
let rows;

function zero_grid(w,h) {
  return [...Array(w)].map(col=>Array(h).fill(false));
}

let cells;

function initCells(w,h) {
  cols = w;
  rows = h;
  let rows2 = 2;

  cells = zero_grid(cols,rows);

  for (let x = 0; x < cols; x++)
  for (let y = 0; y < rows; y++) {
      if (cells[x][y]) {
        fill(255);
        rect(x*resX,y*resY,resX,resY);
      }
      cells[x][y] = random(1) < 0.2;
  }

}

function updateCells() {

  next = zero_grid(cols,rows);

  for (let x = 0; x < cols; x++)
  for (let y = 0; y < rows; y++) {
      let neig = 0;

      if (y-1 >= 0)   neig += cells[x][y-1]; //TOP
      if (x+1 < rows) neig += cells[x+1][y]; //RIGHT
      if (y+1 < cols) neig += cells[x][y+1]; //BOT
      if (x-1 >= 0)   neig += cells[x-1][y]; //LEFT

      if (y-1 >= 0   && x+1 < cols)   neig += cells[x+1][y-1]; //TOP RIGHT
      if (y+1 < cols && x+1 < cols)   neig += cells[x+1][y+1]; //BOT RIGHT
      if (y+1 < cols && x-1 >= 0)     neig += cells[x-1][y+1]; //BOT LEFT
      if (y-1 >= 0   && x-1 >= 0)     neig += cells[x-1][y-1]; //TOP LEFT


      if (cells[x][y] && (neig == 2 || neig == 3)) {
        next[x][y] = true; //lives
      }
      else if (!cells[x][y] && neig == 3) {
        next[x][y] = true; //borns
      }
      else {
        next[x][y] = false; //dies
      }

  }

  cells = next;
}

function displayCells() {

    fill(255);
    noStroke();

    let resX = width/cols;
    let resY = height/rows;

    for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
        if (cells[x][y]) {
          rect(x*resX,y*resY,resX,resY);
        }
    }
}
