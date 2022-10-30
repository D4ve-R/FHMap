#!/usr/bin/env python3

import argparse
from os import path, system, getcwd
from http.server import HTTPServer, SimpleHTTPRequestHandler
import ssl

certPath = path.join(getcwd(), 'server', 'cert')
webPath = path.join(getcwd(), 'server', 'public')

parser = argparse.ArgumentParser(description="dev https server for FHMap")
parser.add_argument('-H', '--host', type=str, default='127.0.0.1')
parser.add_argument('-P', '--port', type=int, default=4443)

class RequestHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=webPath, **kwargs)

if __name__ == '__main__':
    args = parser.parse_args()

    httpd = HTTPServer((args.host, args.port), RequestHandler)
    keyfile=path.join(certPath, 'key.pem')
    certfile=path.join(certPath, 'cert.pem')
    context = ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER)
    context.load_cert_chain(certfile, keyfile)

    httpd.socket = context.wrap_socket (httpd.socket, server_side=True)

    print(f"Server started https://{args.host}:{args.port}")
    system(f"open https://{args.host}:{args.port}")

    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n\nShutting down server")

    httpd.server_close()
