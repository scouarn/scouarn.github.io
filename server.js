const express = require("express");
const http = require("http");

let app = express();
let server = http.createServer(app)

require(__dirname+"/game/gameServer.js")(server);

app.use(express.static(__dirname + "/public"));
server.listen(3000, ()=>{console.log("terminotor : running");});
