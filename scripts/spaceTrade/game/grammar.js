
//http://www.jongware.com/galaxy1.html
const phonemes = [
  'a','e','i','o','u','y',
  "en" , "la" , "can", "be" ,
  "and", "phi", "eth", "ol" ,
  "ve" , "ho" , "er"  , "lia",
  "an" , "ar" , "ur" , "mi" ,
  "in" , "ti" , "k" , "so" ,
  "ed" , "ess", "ex" , "io" ,
  "ce" , "ze" , "fa" , "ay" ,
  "wa" , "da" , "ack", "gre",
  "al" , "tra", "tre", "mm"
];

const romans = ["","I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X"];
const alphabet_up   = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const alphabet_down = "abcdefghijklmnopqrstuvwxyz";

function genName() {
  let str = "";

  for (let i = 0; i < floor(random(2,5)); i++)
    str += phonemes[floor(random(phonemes.length))];
  str = str.charAt(0).toUpperCase() + str.slice(1);

  return str;
}
