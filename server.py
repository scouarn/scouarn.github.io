#for testing

from http.server import HTTPServer, SimpleHTTPRequestHandler, BaseHTTPRequestHandler



class Handler(BaseHTTPRequestHandler) :

    def do_GET(req) :
        if req.path == "/" :
            req.path = "/index.html"

        print(f"asking for {req.path[1:]}")

        try :
            data = open(req.path[1:]).read()
            req.send_response(200)

        except :
            data = "404 file not found"
            req.send_response(404)

        req.end_headers()
        req.wfile.write(bytes(data, 'utf-8'))


server = HTTPServer(('', 8000), SimpleHTTPRequestHandler)
print("running")
server.serve_forever()
