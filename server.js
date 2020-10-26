let http = require("http");
let fs = require("fs");
let path = require("path");

let root = __dirname;

http.createServer(function (request, response) {

  //get file path
  let url = request.url.split("?")[0]; //remove parameters
  let filePath = root + url;
  let fileName = String(path.basename(filePath));

  //redirect to index.html if implied
  if (filePath == root + "/")
      filePath = root + "/index.html";

  //send listing if requested
  if (fileName == '.ls') {
    let dir = filePath.split(".ls")[0];

    try {
      response.writeHead(200, { 'Content-Type': 'application/json' });
      response.end(JSON.stringify(fs.readdirSync(dir),'utf-8'));
    }
    catch(exception) {
      response.writeHead(404, { 'Content-Type': 'application/json' });
      response.end();
    }

    return;
  }

  //file file type
  let mimeTypes = {
        '.html': 'text/html',
        '.js': 'text/javascript',
        '.css': 'text/css',
        '.json': 'application/json',
        '.png': 'image/png',
        '.jpg': 'image/jpg',
        '.gif': 'image/gif',
        '.svg': 'image/svg+xml',
        '.wav': 'audio/wav',
        '.mp4': 'video/mp4',
        '.woff': 'application/font-woff',
        '.ttf': 'application/font-ttf',
        '.eot': 'application/vnd.ms-fontobject',
        '.otf': 'application/font-otf',
        '.wasm': 'application/wasm'
    };
  let fileExt = String(path.extname(filePath)).toLowerCase();
  let contentType = mimeTypes[fileExt] || 'application/octet-stream';

  //send file handling errors
  fs.readFile(filePath, function(error, content) {
      if (error) {
          if(error.code == 'ENOENT') {
            response.writeHead(404);
            response.end('Erreur 404 ! Fichier introuvable');
          }
          else {
            response.writeHead(500);
            response.end('Erreur : '+error.code);
          }
      }
      else {
          response.writeHead(200, { 'Content-Type': contentType });
          response.end(content, 'utf-8');
      }
  });


}).listen(3000);

console.log(__dirname +" online on port 3000 !")
