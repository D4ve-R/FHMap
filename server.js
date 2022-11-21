const fs = require("fs");
const path = require('path')
const https = require("https");
const express = require("express");
const SocketServer = require(path.join(__dirname, 'src', 'server', 'socketserver.js'));
const Database = require(path.join(__dirname, 'src', 'server', 'database.js'));
const DEMProxy = require(path.join(__dirname, 'src', 'server', 'demproxy.js'));
require('dotenv').config();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 4443;
const publicPath = path.join(__dirname, 'server', 'public');
const app = express();

app.use(express.static(publicPath));

const server = https.createServer({
	key: fs.readFileSync(path.join(__dirname,"server", "cert", "key.pem")),
	cert: fs.readFileSync(path.join(__dirname, "server", "cert", "cert.pem")),
	passphrase: process.env.SSL_PASSPHRASE
}, app);

const io = new SocketServer(server);
const db = new Database(app);
const demProxy = new DEMProxy(app);

app.get('/ar', (req, res) => {
	res.sendFile(path.join(publicPath, 'ar.html'));
});

app.get('/indoor', (req, res) => {
	res.sendFile(path.join(publicPath, 'ar-indoor.html'));
});

app.get('/planner', (req, res) => {
	res.sendFile(path.join(publicPath, 'floorplanner.html'));
});

app.get('/floor', (req, res) => {
	res.sendFile(path.join(publicPath, 'floor.html'));
});

app.get('/qr', (req, res) => {
	res.sendFile(path.join(publicPath, 'qr.html'));
});

app.get('/3d', (req, res) => {
	res.sendFile(path.join(publicPath, '3d.html'));
});

server.listen(port, host, ()=>{
    console.log('✅ server is running at https://' + host + ':' + port);
});
