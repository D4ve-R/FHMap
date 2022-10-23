chmod +x createSSLKeys.sh
./createSSLKeys.sh

mkdir -p server/cert
mv *.pem server/cert/

mkdir -p server/public/js
cp -r src/ server/public/

python3 server.py

