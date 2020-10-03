//deja defini dans emulV1.js
//
// const MEMSIZE = 0xFFFF+1;
// const WORDSIZE = 0xFF+1;
//
// const instruction_table = [
//   'ADD','SUB','AND','OR' ,'XOR','NOT','SHL','SHR',
//   'LDA','LFL','POP','PPO','LSL','LSH','LMH','LJH',
//   'STA','SFL','PSH','PSO','SSL','SSH','SMH','SPH',
//   'JMP','CAL','JO' ,'JNO','JN' ,'JNN','JZ' ,'JNZ'
// ];

const special_tokens = [".","_",":",";","/","!"];

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function parseLine(l) {
  return l.split("/")[0].split(" ");
}

function isByte(x) {
  if (x >= WORDSIZE) return false;
  else if (x < -WORDSIZE) return false;
  else return Number.isInteger(parseFloat(x));
}

let currentOutput = [];
let currentBeginAdr = 0;

function assemble() {

  let inputBox = document.getElementById("input");
  let outputBox = document.getElementById("output");
  outputBox.value = "";


  let output = [];
  let errors = [];
  let consts = {};
  let error = function(e,a,l) {errors.push({'e':e,'a':a,'l':l+1});}
  let lines = inputBox.value.split("\n");

  let beginAdr = 0;




  //pré passe
  if (lines[0][0] == "!") {
    let toks = parseLine(lines[0]);
    let val = toks[0].split("!").pop();

    if (toks.length > 1) error("unexpected token",toks[1],l);
    else if (val >= MEMSIZE) error("argument is too big (>0xFFFF)",toks[0],l);
    else beginAdr = val;
  }

  //première passe
  let instAdr = beginAdr;
  for (l = 0; l < lines.length; l++) {
    line = lines[l];

    if (line == "" || line[0] == " ") continue;

    let toks = parseLine(line);

    switch (line[0]) {

      case "_":
        if (consts[toks[0]] != undefined) error("const redefinition",toks[0],l);
        if (toks[1] == undefined) error("missing const argument",toks[0],l);
        else if (isNaN(toks[1])) error("argument is not a number",line,l);
        else if (!isByte(toks[1])) error("const argument is not a byte",toks[1],l);
        else if (toks[1] < 0) consts[toks[0]] = toks[1] + WORDSIZE;
        else consts[toks[0]] = toks[1];
        break;

      case ":":
        if (consts[toks[0]] != undefined) error("array redefinition",toks[0],l);

        if (toks[1] == undefined) { error("missing array argument",toks[0],l); break;}
        else if (!IsJsonString(toks[1])) {error("wrong array argument",toks[1],l); break;}

        let val = JSON.parse(toks[1]);
        for (i = 0; i < val.length; i++)
          if (!isByte(val[i])) { error("an element is not a byte",val[i],l); break;}
          else if (val[i] < 0) val[i] += WORDSIZE;

        consts[toks[0]] = val;
        break;


      case ";":
        if (consts[toks[0]] != undefined) error("string redefinition",toks[0],l);

        let str = line.split(toks[0])[1];
        consts[toks[0]] = [];
        for (i = 1; i < str.length; i++)
          consts[toks[0]].push(str.charCodeAt(i));

        break;

      case ".":
        if (consts[toks[0]] != undefined)
          error("label redefinition",toks[0],l);
        consts[toks[0]] = instAdr & 0xFF;
        consts[toks[0]+"_"] = instAdr >> 8;
        break;


      case "!":
        if (l != 0) error("you must define begin address at line 0",l,l);
        break;

      case "/":
        break;

      default:
        instAdr+=2;
        break;
    }

  }


  //seconde passe
  for (l = 0; l < lines.length; l++) {
    line = lines[l];

    if (line == "" || special_tokens.includes(line[0]) || line[0] == " ") continue;


    let toks = parseLine(line);
    if (toks.length == 1) {
      error("invalid instruction",line,l);
      continue;
    }

    //opcode
    let code = toks[0].split("*")[0];
    let opc = instruction_table.indexOf(code);
    if (opc < 0) error("undefined opcode",code,l);

    //flag
    let fl = toks[0].split("*").length == 2;

    //arg
    let arg = toks[1].split("#").pop();
    if (isNaN(arg)) {
      if (consts[arg] != undefined) arg = consts[arg];
      else error("argument is not a number",arg,l);
    }
    else if (!isByte(arg)) error("argument is not a byte",arg,l);
    else if (arg < 0) arg = parseInt(arg) + WORDSIZE;
    else arg = Number(arg);

    //adr mode
    let md = toks[1][0] != "#";

    //register
    let rg; if (toks[2] == "B") rg = true; else if (toks[2] == undefined || toks[2] == "" || toks[2] == "A") rg = false;
    else error("invalid register",toks[2],l);

    if (errors.length == 0) {
      output.push((opc << 3) | (rg << 2) | (fl << 1) | (md));
      output.push(parseInt(arg));
    }


  }

  //data
  for (key of Object.keys(consts)) {
    if (key[0] != ":" && key[0] != ";") continue;

    let adr = instAdr;
    let val = consts[key];
    for (x of val) {
      output.push(x);
      instAdr ++;
    }
    let endAdr = instAdr -1;

    consts[key] = adr & 0xFF;
    consts[key+"_"] = adr >> 8;
    consts[key+".len"] = val.length;

    consts[key+".end"] = endAdr & 0xFF;
    consts[key+".end_"]= endAdr >> 8;

  }


  if (errors.length == 0) {
    outputBox.style.color = "black";
    outputBox.value += JSON.stringify(output) + "\n\n";

    currentOutput = output;
    currentBeginAdr = beginAdr;

    for (key of Object.keys(consts))
        outputBox.value += key + " = " + consts[key] + "\n";


    outputBox.value += "\nmust be loaded at address " + beginAdr;
  }

  else {
    currentOutput = [];
    currentBeginAdr = 0;
    outputBox.style.color = "red";
    for (e of errors)
      outputBox.value += "Error : " + e.e + " '" + e.a + "'" + " at line " + e.l + "\n";
  }


}
