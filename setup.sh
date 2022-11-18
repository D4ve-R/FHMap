#!/usr/bin/env sh

chmod +x createSSLKeys.sh
chmod +x build.sh
./createSSLKeys.sh

mkdir -p server/cert
mv *.pem server/cert/

mkdir server/public

npm install
npm run build
#./build.sh

npm run serve
#python3 server.py
