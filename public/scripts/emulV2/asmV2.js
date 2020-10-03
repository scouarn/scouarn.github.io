// deja defini dans emulV1.js
//
// const MEMSIZE = 0xFFFF+1;
// const WORDSIZE = 0xFF+1;

const instruction_table = [
  'ADD','SUB','AND','OR' ,'XOR','NOT','SHL','SHR',
  'LDA','LFL','POP','PPO','LSL','LSH','LMH','LJH',
  'STA','SFL','PSH','PSO','SSL','SSH','SMH','SPH',
  'JMP','CAL','JO' ,'JNO','JN' ,'JNN','JZ' ,'JNZ'
];

const special_tokens = [".","_",":",";","/","!"];

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

  //pré passe : début adresse
  if (lines[0][0] == "!") {
    let toks = parseLine(lines[0]);
    let val = toks[0].split("!").pop();

    if (toks.length > 1) error("unexpected token",toks[1],l);
    else if (val >= MEMSIZE) error("argument is too big (>0xFFFF)",toks[0],l);
    else beginAdr = parseInt(val);
  }


  //première passe : assembler les instructions
  let endAdr = beginAdr; //dernière adresse avec des instructions
  for (l = 0; l < lines.length; l++) {
    line = lines[l];
    if (line == "" || line[0] == " " || special_tokens.includes(line[0])) continue;


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
    let arg = toks[1].split("#").pop().split("$").pop();
    if (['_','.',':',';'].includes(arg[0])) {} //arg may be a constant
    else if (isNaN(arg)) error("argument is not a number",arg,l);
    else if (!isByte(arg)) error("argument is not a byte",arg,l);
    else if (arg < 0) arg = Number(arg) + WORDSIZE;
    else arg = Number(arg);


    //adr mode
    let md = (toks[1][0] == "#") || (toks[1][1] == "#");
    let ad = (toks[1][0] == "$") || (toks[1][1] == "$");


    output.push((opc << 3) | (ad << 2) | (fl << 1) | (md)); //OPCODE
    output.push(arg); //ARGUMENT

    endAdr += 2;

  }


  //deuxième passe : constantes
  let instAdr = beginAdr;  //adresse de l'instruction dernièrement visitée (pour les labels)
  for (l = 0; l < lines.length; l++) {
    line = lines[l];
    if (line == "" || line[0] == " ") continue;

    let toks = parseLine(line);

    switch (line[0]) {

      case "_": //CONSTANT

        if (consts[toks[0]] != undefined) error("const redefinition",toks[0],l);
        else if (toks[1] == undefined) error("missing const argument",toks[0],l);
        else if (isNaN(toks[1])) error("argument is not a number",line,l);
        else if (!isByte(toks[1])) error("const argument is not a byte",toks[1],l);
        else if (toks[1] < 0) consts[toks[0]] = Number(toks[1]) + WORDSIZE;
        else consts[toks[0]] = Number(toks[1]);
        break;

      case ".": //LABEL
        if (consts[toks[0]] != undefined) error("label redefinition",toks[0],l);
        else {
          consts[toks[0]] = instAdr & 0xFF;
          consts[toks[0]+"_"] = instAdr >> 8;
        }

        break;

      case ":": //ARRAY
        if (consts[toks[0]] != undefined) error("array redefinition",toks[0],l);
        else if (toks[1] == undefined) error("missing array argument",toks[0],l);
        else
          try {
            let val = JSON.parse(toks[1]);

            consts[toks[0]] = endAdr & 0xFF;
            consts[toks[0]+"_"] = endAdr >> 8;
            consts[toks[0]+".len"] = val.length;

            for (i = 0; i < val.length; i++) {
              if (!isByte(val[i])) { error("an element is not a byte",val[i],l); break;}
              else if (val[i] < 0) val[i] += WORDSIZE;
              output.push(val[i]);
              endAdr ++;
            }

            consts[toks[0]+".end"] = endAdr & 0xFF;
            consts[toks[0]+".end_"] = endAdr >> 8;

          } catch (e) { error("argument is not a json array",toks[1],l);}

        break;

      case ";": //STRING
        if (consts[toks[0]] != undefined) error("string redefinition",toks[0],l);
        else if (toks[1] == undefined) error("missing string",toks[0],l);
        else {

          let str = line.split(toks[0]+" ")[1]; //" "-> enlever l'espace au début du string

          consts[toks[0]] = endAdr & 0xFF;
          consts[toks[0]+"_"] = endAdr >> 8;
          consts[toks[0]+".len"] = str.length;

          for (i = 0; i < str.length; i++) {
            let char = str.charCodeAt(i);
            if (char > 255) { error("string must be using ASCII characters only",str[i],l); break;}
            output.push(char);
            endAdr ++;

          }

          consts[toks[0]+".end"] = endAdr & 0xF;
          consts[toks[0]+".end_"] = endAdr >> 4;
        }
        break;


      case "!": //ERROR WITH START ADDRESS
        if (l != 0) error("you must be defined at line 0",line,l);
        break;

      case "/": //COMMENT
        break;

      default:  //INSTRUCTION
        instAdr+=2;
        break;
    }

  }

  //troisième passe : remplacer les constantes dans les arguments
  for (i = 0; i < output.length; i++) {
    let val = output[i];
    if (typeof(val) == "number") continue;
    else if (consts[val] == undefined) {
      for (l = 0; l < lines.length; l++)  //trouver la ligne de l'erreur
        if (parseLine(lines[l]).includes(val)) {
          error("undefined constant",val,l);
          break;
        }
    }
    else output[i] = consts[val];
  }

  if (output.length + beginAdr >= MEMSIZE) error("program to large or begin address too far",output.length + beginAdr,undefined);

  //envoyer l'output
  if (errors.length == 0) {
    outputBox.style.color = "black";
    outputBox.value += JSON.stringify(output) + "\n\n";

    currentOutput = output;
    currentBeginAdr = beginAdr;

    for (key of Object.keys(consts))
        outputBox.value += key + " = " + consts[key] + "\n";

    outputBox.value += "Program length : " + output.length + "\n";

  }
  else {  //erreurs
    currentOutput = [];
    currentBeginAdr = 0;
    outputBox.style.color = "red";
    for (e of errors)
      outputBox.value += "Error : " + e.e + " '" + e.a + "'" + " at line " + e.l + "\n";
  }


}
