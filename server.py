from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

host = '192.168.178.147'
port = 4443

httpd = HTTPServer((host, port), SimpleHTTPRequestHandler)

httpd.socket = ssl.wrap_socket (httpd.socket, 
                keyfile="server/key.pem", 
                certfile='server/cert.pem',
                server_side=True)

print(f"Server started https://{host}:{port}")
httpd.serve_forever()
