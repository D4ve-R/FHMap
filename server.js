const fs = require("fs");
const path = require('path')
const https = require("https");
const express = require("express");
const SocketServer = require(path.join(__dirname, 'src', 'server', 'socketserver.js'));
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 4443;
const DEM_API_SERVICE_URL = process.env.DEM_API_SERVICE_URL;
const publicPath = path.join(__dirname, 'server', 'public');
const app = express();

app.use(express.static(publicPath));

const server = https.createServer({
	key: fs.readFileSync(path.join(__dirname,"server", "cert", "key.pem")),
	cert: fs.readFileSync(path.join(__dirname, "server", "cert", "cert.pem")),
	passphrase: process.env.SSL_PASSPHRASE
},app);

const io = new SocketServer(server);

app.get('/ar', (req, res) => {
	res.sendFile(path.join(publicPath, 'ar.html'));
});

app.get('/indoor', (req, res) => {
	res.sendFile(path.join(publicPath, 'ar-indoor.html'));
});

app.get('/planner', (req, res) => {
	res.sendFile(path.join(publicPath, 'floorplanner.html'));
});

app.get('/qr', (req, res) => {
	res.sendFile(path.join(publicPath, 'qr.html'));
});

app.get('/3d', (req, res) => {
	res.sendFile(path.join(publicPath, '3d.html'));
});

app.get("/dem/x/:x/y/:y/z/:z", createProxyMiddleware({
	target: DEM_API_SERVICE_URL,
	changeOrigin: true,
	pathRewrite: {
		'^/dem/^': ''
	},
	on: {
		proxyReq: (proxyReq, req) => {
			proxyReq.path += `${req.params.z}/${req.params.x}/${req.params.y}.png`;
		}
	}
}));

server.listen(port, host, ()=>{
    console.log('✅ server is running at https://' + host + ':' + port);
});
