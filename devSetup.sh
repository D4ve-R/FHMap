chmod +x createSSLKeys.sh
./createSSLKeys.sh

mkdir server
mv *.pem server

python3 server.py

