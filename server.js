const fs = require("fs");
const path = require('path');

if (process.env.NODE_ENV !== 'production') {
	require('dotenv').config();
}

const https = require("https");
const serverOptions = {
	key: fs.readFileSync(path.join(__dirname,"server", "cert", "key.pem")),
	cert: fs.readFileSync(path.join(__dirname, "server", "cert", "cert.pem")),
	passphrase: process.env.SSL_PASSPHRASE
}

if (process.env.NODE_ENV !== 'production') {
	if(process.env.DEBUG === 'true' || process.env.DEBUG === 'express:*')
		process.env.DEBUG = 'express:*';
}
const express = require("express");

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 4443;
const publicPath = path.join(__dirname, 'server', 'public');

const SocketServer = require(path.join(__dirname, 'src', 'server', 'socketserver.js'));
const Database = require(path.join(__dirname, 'src', 'server', 'database.js'));
const DEMProxy = require(path.join(__dirname, 'src', 'server', 'demproxy.js'));

const app = express();
app.use(express.static(publicPath));

const server = https.createServer(serverOptions, app);

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
    console.log('✅ Server is running at https://' + host + ':' + port);
});

process.on('SIGINT', () => {
	console.log('\nShutting down!');
	process.exit();
});
