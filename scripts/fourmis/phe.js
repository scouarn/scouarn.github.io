function zero_grid(w,h) {
  return [...Array(w)].map(col=>Array(h).fill(0));
}


function initCells(w,h) {
  let cells = zero_grid(w,h);

  return cells;

}

function decay(cells,val) {

  let cols = cells.length;
  let rows = cells[0].length;

  next = zero_grid(cols,rows);

  for (let x = 0; x < cols; x++)
  for (let y = 0; y < rows; y++) {
      next[x][y] = cells[x][y] * val;
  }

  return next ;
}

function displayCells(cells) {

    noStroke();

    let cols = cells.length;
    let rows = cells[0].length;

    let resX = width/cols;
    let resY = height/rows;

    for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
        fill(cells[x][y]);
        rect(x*resX,y*resY,resX,resY);
    }
}
