!0x9000
;STR INTERRUPT

_INDEX 100
_FL 101

LMH #0x90
LJH #0x90

//iret values
POP #_FL

//boucle for : i=0; i<;STR.len; i++
LDA #0
STA #_INDEX  //i=0

.loop
LDA _INDEX
LDA $;STR

LMH #0xFF
STA #1   //print char

LMH #0x90
LDA _INDEX
ADD #1          //index += 1
STA #_INDEX
SUB* #;STR.len  //compare si i<;STR.len
JN #.loop       //saute si i>=;STR.len

LMH #0xFF
LDA #10
STA #1   //print \n



//retour de l'interruption
LFL _FL
