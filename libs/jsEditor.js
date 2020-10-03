let editor;
let socket;
let fileName;
let currentLineNumber;

function initEditor() {

  //init ace
  editor = ace.edit("input", {
      mode: "ace/mode/javascript",
      selectionStyle: "text"
  });

  editor.setFontSize(18);

  socket = io();


  //changer le document
  socket.on("answerFile",handleChanges);
  socket.on("newFileError",()=>{alert("Ce nom n'est pas valide");fileName=undefined});
  socket.on("newFileOK",()=>{let url = window.location.href.split("?")[0];window.location.href = url + "?" + fileName;});

  //demander le fichier
  fileName = window.location.href.split("?")[1];
  if (fileName != undefined && fileName != "") socket.emit("askFile",fileName);
  else editor.setValue("connectez-vous sur un pad",-1)

  //broadcast changes
  editor.textInput.getElement().onkeyup = sendChanges;


}


function startP5() {
  let script = "<script>" + editor.getValue() + "</script>";
  document.getElementById("p5sketch").srcdoc = "<script src='https://cdnjs.cloudflare.com/ajax/libs/p5.js/0.10.2/p5.min.js'></script>" + script;
}

function stopP5() {
  document.getElementById("p5sketch").srcdoc = "";
}

function sendChanges() {
  let newLineNumber = editor.getSession().getScreenLength();
  let addedLines = newLineNumber - currentLineNumber;
  currentLineNumber = newLineNumber;

  socket.emit("fileChange",fileName,editor.getValue(),addedLines,editor.getCursorPosition().row);
}

function handleChanges(data,addedLines,row) {
  let dy = addedLines;

  let range = editor.getSelectionRange();

  if (row < editor.getCursorPosition().row) {
    range.start.row += dy;
    range.end.row += dy;
  }

  editor.setValue(data,-1);
  editor.getSelection().setSelectionRange(range);
  currentLineNumber = editor.getSession().getScreenLength();
}

function saveFile() {
  if (fileName != undefined) socket.emit("saveFile",fileName,editor.getValue());
}

function newFile() {
  let newName = prompt("Nom du nouveau pad :");

  if (newName != null) {
    fileName = newName.replace(/[ &\/\\#,+()$~%.'":*?<>{}]/g, "") + ".js";
    socket.emit("newFile",fileName);
  }

}

function downloadFile() {
  let name;
  if (fileName == undefined) name = "sketch.js";
  else name = fileName

  let elem = document.createElement('a');
  elem.setAttribute('href', 'data:text/javascript;charset=utf-8,' + encodeURIComponent(editor.getValue()));
  elem.setAttribute('download', name);

  elem.style.display = 'none';
  document.body.appendChild(elem);
  elem.click();
  document.body.removeChild(elem);
}
