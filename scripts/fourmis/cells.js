function zero_grid(w,h) {

  let grid = Array.from(Array(w), () => new Array(h));


  for (let i = 0; i < w; i++)
  for (let j = 0; j < w; j++)
    grid[i][j] =
      {
        home : 0,
        food : 0,
        wall : false
      };


  return grid;
}


function initCells(w,h) {
  let cells = zero_grid(w,h);

  return cells;

}

function decay(cells,val) {

  for (let rows of cells)
  for (let cell of rows)
    {
      cell.home *= val;
      cell.food *= val;
    }

}

function displayCells(cells) {

    noStroke();

    let cols = cells.length;
    let rows = cells[0].length;

    let resX = width/cols;
    let resY = height/rows;

    for (let x = 0; x < cols; x++)
    for (let y = 0; y < rows; y++) {
        fill(cells[x][y].home);
        rect(x*resX,y*resY,resX,resY);
    }
}
