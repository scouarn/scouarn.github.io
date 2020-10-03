const MEMSIZE = 0xFFFF+1;
const WORDSIZE = 0xFF+1;

const instruction_table = [
  'ADD','SUB','AND','OR' ,'XOR','NOT','SHL','SHR',
  'LDA','LFL','POP','PPO','LSL','LSH','LMH','LJH',
  'STA','SFL','PSH','PSO','SSL','SSH','SMH','SPH',
  'JMP','CAL','JO' ,'JNO','JN' ,'JNN','JZ' ,'JNZ'
];


let mac;
let output;


let program = [

  //init : je définie les variables,
  //a = 1 à l'adresse 0xFF00
  //b = 1 à l'adresse 0xFF01
  112,0xFF, //LMH (imm)
  64,1,     //LDA (imm)
  128,0,    //STA (imm)
  128,1,    //STA (imm)

  //c = a + b : je place c à l'adresse 0xFF02
  65,0,     //LDA
  3,1,      //ADD
  128,2,    //STA (imm)

  //a = b
  65,1,     //LDA
  128,0,    //STA (imm)

  //b = c
  65,2,     //LDA
  128,1,    //STA (imm)

  //loop : saute à 8 (c = a + b)
  216,8,    //JNO (imm)

  //halt : saute à 0xFFFF
  120,0xFF, //LJH (imm)
  192,0xFF  //JMP (imm)

];

function init(prg) {
  if (mac) mac.stop();
  mac = new Machine();
  if (prg != undefined) mac.load(prg);
  output = document.getElementById("emul-output");
  output.value = "";
}


function Machine() {
  this.mem = [];
  for (i = 0; i < MEMSIZE; i++)
    this.mem.push(0);

  this.PC = 0;
  this.SP = 0;
  this.MH = 0;
  this.OP = 0;
  this.A  = 0;
  this.B  = 0;
  this.FL = 0;
  this.JH = 0;

  this.flag_overflow = false;
  this.flag_int = false;

  this.clock;

}

Machine.prototype.start = function(int = 100) {
  clearInterval(this.clock);
  this.clock = setInterval(this.step,int,this);
}

Machine.prototype.stop = function() {
  clearInterval(this.clock);
}

Machine.prototype.step = function (self = this) {

  if (self.PC >= MEMSIZE-2) { //HALT
    self.stop();
    return;
  }

  //FETCH
  let op  = self.mem[self.PC];
  let arg = self.mem[self.PC+1];
  self.PC += 2;


  //DECODE
  let rg  = (op & 4) != 0;
  let fl  = (op & 2) != 0;
  let md  = (op & 1) != 0;

  let opc = op >> 3;
  let val;
  if (md) val = self.mem[(self.MH << 8) | arg]; else val = arg;


  //EXECUTE
  self.flag_overflow = false;
  instructions[opc](self,val,rg);

  if (fl)
    switch (rg) {
      case false: self.latch_flag(self.A); break;
      case true : self.latch_flag(self.B); break;
    }

  output.value += instruction_table[opc] + " " + arg;
  if (md) output.value += " (" + val + ")";
  output.value += "\n";

};

Machine.prototype.load = function (program, adr = 0) {

  if (program.length + adr > MEMSIZE) {
    throw "Not enought memory";
    return;
  }

  for (i = 0; i < program.length; i++)
    this.mem[i+adr] = program[i];
};

Machine.prototype.latch_flag = function (val) {
  let flags = (this.flag_int) | (val == 0) | ((val & 128) != 0) | (this.flag_overflow);
  this.FL &= 0b11110000;
  this.FL |= flags;
};

Machine.prototype.overflow = function (val) {
  if (val >= WORDSIZE) {
    this.flag_overflow = true;
    return val - WORDSIZE;
  }
  else if (val < 0) {
    this.flag_overflow = true;
    return WORDSIZE-val;
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

  (m,val,rg)=>{ // ADD
    switch (rg) {
      case false: m.A += val; m.A = m.overflow(m.A); break;
      case true : m.B += val; m.B = m.overflow(m.B); break;
    }
  },

  (m,val,rg)=>{ // SUB
    switch (rg) {
      case false: m.A -= val; m.A = m.overflow(m.A); break;
      case true : m.B -= val; m.B = m.overflow(m.B); break;
    }
  },

  (m,val,rg)=>{ // AND
    switch (rg) {
      case false: m.A &= val; break;
      case true : m.B &= val; break;
    }
  },

  (m,val,rg)=>{ // OR
    switch (rg) {
      case false: m.A |= val; break;
      case true : m.B |= val; break;
    }
  },

  (m,val,rg)=>{ // XOR
    switch (rg) {
      case false: m.A ^= val; break;
      case true : m.B ^= val; break;
    }
  },

  (m,val,rg)=>{ // NOT
    switch (rg) {
      case false: m.A = ~val; break;
      case true : m.B = ~val; break;
    }
  },

  (m,val,rg)=>{ // SHL
    switch (rg) {
      case false: m.A = val<<1; break;
      case true : m.B = val<<1; break;
    }
  },

  (m,val,rg)=>{ // SHR
    switch (rg) {
      case false: m.A = val>>1; break;
      case true : m.B = val>>1; break;
    }
  },



  (m,val,rg)=>{ // LDA
    switch (rg) {
      case false: m.A = val; break;
      case true : m.B = val; break;
    }
  },

  (m,val,rg)=>{ // LFL
    m.FL = val;
  },

  (m,val,rg)=>{ // POP
    m.SP--; m.SP = m.memModulo(m.SP);
    m.mem[val] = m.mem[m.SP];
  },

  (m,val,rg)=>{ // PPO
    switch (rg) {
      case false: m.A = m.mem[m.SP - val]; break;
      case true : m.B = m.mem[m.SP - val]; break;
    }
  },

  (m,val,rg)=>{ // LSL
    m.SP &= 0b1111111100000000;
    m.SP |= val;
  },

  (m,val,rg)=>{ // LSH
    m.SP &= 0b0000000011111111;
    m.SP |= val << 8;
  },

  (m,val,rg)=>{ // LMH
    m.MH = val;
  },

  (m,val,rg)=>{ // LJH
    m.JH = val
  },


  (m,val,rg)=>{ // STA
    switch (rg) {
      case false: m.mem[(m.MH << 8) | val] = m.A; break;
      case true : m.mem[(m.MH << 8) | val] = m.B; break;
    }
  },

  (m,val,rg)=>{ // SFL
    m.mem[(m.MH << 8) | val] = m.FL;
  },

  (m,val,rg)=>{ // PSH
    m.mem[m.SP] = m.mem[val];
    m.SP++; m.SP = m.memModulo(m.SP);
  },

  (m,val,rg)=>{ // PSO
    switch (rg) {
      case false: m.mem[m.SP - val] = m.A; break;
      case true : m.mem[m.SP - val] = m.B; break;
    }
  },

  (m,val,rg)=>{ // SSL
    m.mem[(m.MH << 8) | val] = m.SP &= 0b0000000011111111;
  },

  (m,val,rg)=>{ // SSH
    m.mem[(m.MH << 8) | val] = m.SP >> 8;
  },

  (m,val,rg)=>{ // SMH
    m.mem[(m.MH << 8) | val] = m.MH;
  },

  (m,val,rg)=>{ // SPH
    m.mem[(m.MH << 8) | val] = m.PC >> 8;
  },



  (m,val,rg)=>{ // JMP
    m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // CAL
    m.mem[m.SP] = m.PC & 0b0000000011111111;
    m.SP++; m.SP = m.memModulo(m.SP);
    m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JO
    if ((m.FL & 0b0001) != 0)
      m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JNO
    if ((m.FL & 0b0001) == 0)
      m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JN
    if ((m.FL & 0b0010) != 0)
      m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JNN
    if ((m.FL & 0b0010) == 0)
      m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JZ
    if ((m.FL & 0b0100) != 0)
      m.PC = (m.JH << 8) | val;
  },

  (m,val,rg)=>{ // JNZ
    if ((m.FL & 0b0100) == 0)
      m.PC = (m.JH << 8) | val;
  }

];
