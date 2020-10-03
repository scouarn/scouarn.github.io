let speed = 5;
let size = 15;
let res;

let apple;
let snake;
let dir;

const MENU = 0;
const GAME = 1;
let state = MENU;


function setup() {

  createCanvas(600,600);

}

function draw() {

  switch (state) {
    case GAME : moveSnake(); displayGame(); break;
    case MENU : showMenu(); break;
  }


}

function keyPressed() {

  switch (state) {
    case GAME:
      if (keyCode == LEFT_ARROW)
        dir = [dir[1],-dir[0]];
      else if (keyCode == RIGHT_ARROW)
        dir = [-dir[1],dir[0]];

      break;


    case MENU:
      if (keyCode == LEFT_ARROW)
        size = max(size-1,2);
      else if (keyCode == RIGHT_ARROW)
        size = min(size+1,100);
      else if (keyCode == UP_ARROW)
        speed = min(speed+1,60);
      else if (keyCode == DOWN_ARROW)
        speed = max(speed-1,1);
      else if (keyCode == 32) {
        initGame();
      }
      break;
  }



}

function moveSnake() {

  let newPos = [snake[0][0]+dir[0],snake[0][1]+dir[1]]
  if (snakeIncludes(newPos) || newPos[0] < 0 || newPos[1] < 0 || newPos[0] >= size || newPos[1] >= size) {
    state = MENU;
    return;
  }


  snake.unshift(newPos);

  if (newPos[0] == apple[0] && newPos[1] == apple[1])
    apple = newApple();
  else
    snake.pop();


}

function snakeIncludes(pos) {

  for (position of snake)
    if (pos[0] == position[0] && pos[1] == position[1])
      return true;

  return false;

};

function newApple() {
  let pos = [floor(random()*size),floor(random()*size)];

  if (snakeIncludes(pos))
    return newApple();
  else
    return pos;
}

function initGame() {
  state = GAME;

  let s = floor(size/2)
  snake = [[s,s],[s-1,s]];
  apple = newApple();
  dir = [1,0];
  frameRate(speed);

}

function displayGame() {


  background(0);
  noStroke();

  res = min(width/size,height/size);

  fill(255,0,0);
  rect(apple[0]*res,apple[1]*res,res,res);

  fill(0,255,0);
  for (pos of snake)
    rect(pos[0]*res,pos[1]*res,res,res);

  fill(255);
  textSize(32);
  textAlign(LEFT);
  text("score : " + snake.length, 10,32);

}


function showMenu() {
  background(0);
  fill(255);

  textAlign(CENTER);
  textSize(64);
  text("SNAKE",width/2,height/2);

  textSize(32);
  text("press space to start",width/2,height/2 + 32);

  text("speed (↑↓) : " + speed,width/2,height-48);
  text("size  (⇄)  : " + size,width/2,height-10);

}
