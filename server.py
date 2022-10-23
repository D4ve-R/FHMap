import argparse
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

parser = argparse.ArgumentParser(description="dev https server for FHMap")
parser.add_argument('-H', '--host', type=str, default='127.0.0.1')
parser.add_argument('-P', '--port', type=int, default=4443)

if __name__ == '__main__':
    args = parser.parse_args()

    httpd = HTTPServer((args.host, args.port), SimpleHTTPRequestHandler)

    httpd.socket = ssl.wrap_socket (httpd.socket, 
                keyfile="server/key.pem", 
                certfile='server/cert.pem',
                server_side=True)

    print(f"Server started https://{args.host}:{args.port}")
    httpd.serve_forever()
