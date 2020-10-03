function Printer(elem) {
  this.elem = elem;
  this.num =  function(val) {elem.value += val;};
  this.char = function(val) {elem.value += String.fromCharCode(val);};
}
