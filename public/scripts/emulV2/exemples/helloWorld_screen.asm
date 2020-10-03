//EXEMPLE DE BOUCLE FOR

//init le string et les adresses
//des variables
;STR HELLO WORLD!
_INDEX 100
_CURRENT 101

//init
LSH #0x80



//boucle for : i=0; i<;STR.len; i++
LDA #0
STA #_INDEX  //i=0

.loop
LDA _INDEX
LDA $;STR
STA #_CURRENT
PSH _CURRENT  //ajoute dans la VRAM

LDA _INDEX
ADD #1          //index += 1
STA #_INDEX
SUB* #;STR.len  //compare si i<;STR.len
JN #.loop       //saute si i>=;STR.len


//refresh l'écran
LDA #128
LMH #0xFF
STA #0

//halt
LJH #0xFF
JMP #0xFF
