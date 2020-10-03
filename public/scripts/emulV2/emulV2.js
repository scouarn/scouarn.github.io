const MEMSIZE = 0xFFFF+1;
const WORDSIZE = 0xFF+1;
const VRAMSTART = 0x8000;
const VRAMLENGTH = 4096;
const VRAMTEXTLENGTH = 51*80;

let mac;

//exemple
let testIntPrg = [113,144,121,144,81,101,65,0,129,100,64,100,68,38,113,255,129,1,113,144,64,100,1,1,129,100,11,9,225,10,113,255,65,10,129,1,72,101,73,78,84,69,82,82,85,80,84];

function init(prg) {
  mac = new Machine();
  mac.load(testIntPrg, 0x9000);

  let printerOutput = document.getElementById("printer-output");
  printerOutput.value = "";
  let printer = new Printer(printerOutput);

  mac.hardware[0xFF00] = {"write": screenHandler, "read":null};
  mac.hardware[0xFF01] = {"write": printer.char, "read":null};
  mac.hardware[0xFF02] = {"write": printer.num,  "read":null};


}


////////////////////////////////////////////////////////
///// MACHINE CLASS
////////////////////////////////////////////////////////

function Machine() {
  this.mem = [];
  for (i = 0; i < MEMSIZE; i++)
    this.mem.push(0);

  this.PC = 0;
  this.SP = 0;
  this.MH = 0;
  this.A  = 0;
  this.FL = 0;
  this.JH = 0;

  this.hardware = {};

  this.adrBusBit8 = false;

  this.flag_overflow = false;
  this.flag_int_delta = 0;
  this.running = false;
  this.interval = 10;

  this.intResquests = [];

}

Machine.prototype.requestInterrupt = function (adr) {
  this.intResquests.unshift(adr);

  //si n'est pas interrompu et n'est pas en train de tourner
  if ((this.FL & 8) == 0 && this.running == false) this.step(this);
}

Machine.prototype.handleInterrupt = function (adr) {

  this.write(this.SP, this.PC & 0xFF); //push PCL
  this.write(this.SP+1, this.PC >> 8); //push PCH
  this.write(this.SP+2, this.A);       //push ACC
  this.write(this.SP+3, this.JH);      //push JH
  this.write(this.SP+4, this.MH);      //push MH
  this.write(this.SP+5, this.FL);      //push FL
  this.SP+=6; this.SP = this.memModulo(this.SP);

  this.FL |= 8; //active le flag int
  this.PC = adr; //saute
}

Machine.prototype.intReturn = function() {

  this.MH = this.read(this.SP-1);
  this.JH = this.read(this.SP-2);
  this.A = this.read(this.SP-3);
  this.PC = (this.read(this.SP-4) << 8) | this.read(this.SP-5);


  this.SP-=5; this.SP = this.memModulo(this.SP);



}

Machine.prototype.write = function(adr,val) {
  if (adr >= MEMSIZE || adr < 0) return;

  let device = this.hardware[adr];
  if (device != undefined && device.write != undefined && device.write != null)
    device.write(val);

  this.mem[adr] = val;
}

Machine.prototype.read = function(adr) {
  if (adr >= MEMSIZE || adr < 0) return 0;

  let device = this.hardware[adr];
  if (device != undefined && device.read != undefined && device.read != null)
    return device.read();

  else return this.mem[adr];
}

let printer;Machine.prototype.start = function() {
  this.running = true;
  this.step(this);
}

Machine.prototype.stop = function() {
  this.running = false;
}

Machine.prototype.step = function (self = this) {

  //si le flag int a été mis par le programme -> interruption interne
  if (self.flag_int_delta == 1) {
    self.handleInterrupt((self.JH << 8) | self.A);
    self.flag_int_delta = 0;
  }


  //si le flag int a été enlevé par le programme -> retour d'interruption
  else if (self.flag_int_delta == -1) {
    self.intReturn();
    self.flag_int_delta = 0;
    if (self.running == false) return;
  }

  //si n'est pas interrompu et si il y a des demandes d'int -> interruption externe
  else if ((self.FL & 8) == 0 && self.intResquests.length > 0) {
    self.handleInterrupt(self.intResquests.pop());
  }





  if (self.PC >= MEMSIZE-2) { //HALT
    self.stop();
    return;
  }

  //FETCH
  let op  = self.mem[self.PC];
  let arg = self.mem[self.PC+1];
  self.PC += 2;


  //DECODE
  let ad  = (op & 4) != 0;
  let fl  = (op & 2) != 0;
  let md  = (op & 1) != 0;

  let opc = op >> 3;

  let val;
  if (!md && !ad) val = self.read((self.MH << 8) | arg); //50
  else if (!md && ad) val = self.read(((self.MH << 8) | arg) + self.A); //$50
  else if (md && !ad) val = arg; //#50
  else if (md && ad) { //$#50
    if (arg + self.A > WORDSIZE) self.adrBusBit8 = true;
    else self.adrBusBit8 = false;
    val = (arg + self.A) % WORDSIZE;
  }


  //EXECUTE
  self.flag_overflow = false;
  instructions[opc](self,val);


  if (fl) {
    let flags = ((self.A == 0)<<2) | (((self.A & 128) != 0)<<1) | (self.flag_overflow);
    self.FL &= 0b11111000;
    self.FL |= flags;
  }


  //next instruction
  if (self.running || (self.FL & 8) != 0 || self.flag_int_delta != 0) setTimeout(self.step,self.interval,self);


};

Machine.prototype.load = function (program, adr = 0) {

  if (program.length + adr > MEMSIZE) {
    throw "Not enought memory";
    return;
  }

  for (i = 0; i < program.length; i++)
    this.mem[i+adr] = program[i];
};


Machine.prototype.overflow = function (val) {
  if (val >= WORDSIZE) {
    this.flag_overflow = true;
    return val % WORDSIZE;
  }
  else if (val < 0) {
    this.flag_overflow = true;
    return val + WORDSIZE;
  }
  else
    return val;
};

Machine.prototype.memModulo = function (val) {
  if (val >= MEMSIZE) return val - MEMSIZE;
  else if (val < 0) return MEMSIZE-val;
  else return val;
};

const instructions = [

  (m,val)=>{ // ADD
    m.A += val; m.A = m.overflow(m.A);
  },

  (m,val)=>{ // SUB
    m.A -= val; m.A = m.overflow(m.A);
  },

  (m,val)=>{ // AND
    m.A &= val;
  },

  (m,val)=>{ // OR
    m.A |= val;
  },

  (m,val)=>{ // XOR
    m.A ^= val;
  },

  (m,val)=>{ // NOT
    m.A = ~val; break;
  },

  (m,val)=>{ // SHL
    m.A = val<<1;
  },

  (m,val)=>{ // SHR
    m.A = val>>1;
  },



  (m,val)=>{ // LDA
    m.A = val;
  },

  (m,val)=>{ // LFL
    m.flag_int_delta = ((val & 8) >> 3) - ((m.FL & 8) >> 3);
    m.FL = val;
  },

  (m,val)=>{ // POP
    m.SP--; m.SP = m.memModulo(m.SP);
    m.write((m.MH+(m.adrBusBit8) << 8) | val,m.read(m.SP));
  },

  (m,val)=>{ // PPO
    m.A = read(m.SP - val);
  },

  (m,val)=>{ // LSL
    m.SP &= 0xFF00;
    m.SP |= val;
    m.SP += m.adrBusBit8 << 8; m.SP = m.memModulo(m.SP);
  },

  (m,val)=>{ // LSH
    m.SP &= 0xFF;
    m.SP |= val << 8;
  },

  (m,val)=>{ // LMH
    m.MH = val;
  },

  (m,val)=>{ // LJH
    m.JH = val
  },


  (m,val)=>{ // STA
    m.write(((m.MH+m.adrBusBit8) << 8) | val,m.A);
  },

  (m,val)=>{ // SFL
    m.write(((m.MH+m.adrBusBit8) << 8) | val,m.FL);
  },

  (m,val)=>{ // PSH
    m.write(m.SP, val);
    m.SP++; m.SP = m.memModulo(m.SP);
  },

  (m,val)=>{ // PSO
    m.write(m.SP - val, m.A);
  },

  (m,val,rg)=>{ // SSL
    m.write(((m.MH+m.adrBusBit8) << 8) | val, m.SP &= 0b0000000011111111);
  },

  (m,val)=>{ // SSH
    m.write(((m.MH+m.adrBusBit8) << 8) | val, m.SP >> 8);
  },

  (m,val)=>{ // SMH
    m.write(((m.MH+m.adrBusBit8) << 8) | val, m.MH);
  },

  (m,val)=>{ // SPH
    m.write(((m.MH+m.adrBusBit8) << 8) | val,m.PC >> 8);
  },



  (m,val)=>{ // JMP
    m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // CAL
    m.write(m.SP,m.PC & 0xFF);
    m.SP++; m.SP = m.memModulo(m.SP);
    m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JO
    if ((m.FL & 0b0001) != 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JNO
    if ((m.FL & 0b0001) == 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JN
    if ((m.FL & 0b0010) != 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JNN
    if ((m.FL & 0b0010) == 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JZ
    if ((m.FL & 0b0100) != 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  },

  (m,val)=>{ // JNZ
    if ((m.FL & 0b0100) == 0)
      m.PC = ((m.JH+m.adrBusBit8) << 8) | val;
  }

];
