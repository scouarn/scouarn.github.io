let programBox = document.getElementById("program");
let outputBox = document.getElementById("output");
let ptrBox = document.getElementById("PTR");
let pcBox = document.getElementById("PC");
let stepBox = document.getElementById("STEP");

const MEMSIZE = 1024;

let mem;
let progCounter;
let pointer;
let stp;
let running;

let opcodes = {
  '>':()=>{pointer++; if (pointer < 0) pointer = MEMSIZE-1; if (pointer >= MEMSIZE) pointer = 0;},
  '<':()=>{pointer--; if (pointer < 0) pointer = MEMSIZE-1; if (pointer >= MEMSIZE) pointer = 0;},

  '+':()=>{mem[pointer]++; if (mem[pointer] < 0) mem[pointer] = 255; if (mem[pointer] > 255) mem[pointer] = 0;},
  '-':()=>{mem[pointer]--; if (mem[pointer] < 0) mem[pointer] = 255; if (mem[pointer] > 255) mem[pointer] = 0;},

  '.':()=>{outputBox.innerHTML += String.fromCharCode(mem[pointer]);},
  ',':()=>{let i = prompt("Enter a character :"); if (i != '') mem[pointer] = i.charCodeAt(0);},

  '[':()=>{if (mem[pointer] != 0) return;
           let prog = programBox.value;
           let dep = 0;

           do {
             if      (prog[progCounter] == '[') dep --;
             else if (prog[progCounter] == ']') dep ++;
             progCounter++;
           } while(dep != 0);
           progCounter++;
          },

  ']':()=>{if (mem[pointer] == 0) return;
           let prog = programBox.value;
           let dep = 0;

           do {
             if      (prog[progCounter] == '[') dep --;
             else if (prog[progCounter] == ']') dep ++;
             progCounter--;
           } while(dep != 0);
           progCounter++;
          }
}

init();

function start() {
  init();
  running = true;
  step();
}


function stop() {
  if (running) {
    outputBox.innerHTML += " --END-- ";
    running = false;
  }

}

function init() {
  pointer = 0;
  progCounter = 0;
  stp = 0;
  outputBox.innerHTML = "";
  running = false;
  mem = [];
  for (i = 0; i < MEMSIZE; i++)
    mem.push(0);

  outputInfo();
}

function step() {
  let prog = programBox.value;

  if (progCounter >= prog.length) {
    stop();
    return;
  }

  let opcode = prog[progCounter];
  let ins = opcodes[opcode];
  if (ins != undefined)
    ins(); //execute instruction

  progCounter ++;
  stp ++;
  outputInfo();

  if (running)  //loop
    setTimeout(step, 1);
}

function outputInfo() {
  ptrBox.innerHTML = "PTR : " + pointer;
  pcBox.innerHTML = "PC : " + progCounter;
  stepBox.innerHTML = "STEP : " + stp;
}
