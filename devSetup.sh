#!/usr/bin/env sh

chmod +x createSSLKeys.sh
chmod +x build.sh
./createSSLKeys.sh

mkdir -p server/cert
mv *.pem server/cert/

mkdir server/public
cp -r src/ server/public/

python3 server.py
