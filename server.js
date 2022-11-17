const fs = require("fs");
const path = require('path')
const https = require("https");
const express = require("express");
const { createProxyMiddleware } = require('http-proxy-middleware');
require('dotenv').config();

const host = process.env.HOST || "127.0.0.1";
const port = process.env.PORT || 4443;
const API_SERVICE_URL = process.env.API_SERVICE_URL || "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/";

const app = express();
app.use(express.static(path.join(__dirname,"server/public")));

https.createServer({
	key: fs.readFileSync("server/cert/key.pem"),
	cert: fs.readFileSync("server/cert/cert.pem"),
	passphrase: process.env.SSL_PASSPHRASE
  },app)
  .listen(port, host, ()=>{
    console.log('server is running at ' + host + ':' + port);
  });


app.get("/dem/x/:x/y/:y/z/:z", createProxyMiddleware({
	target: API_SERVICE_URL,
	changeOrigin: true,
	pathRewrite: {
		'^/dem/^': ''
	},
	on: {
		proxyReq: (proxyReq, req) => {
			console.log('proxyReq', proxyReq.path);
			proxyReq.path += `${req.params.z}/${req.params.x}/${req.params.y}.png`;
		}
	}
}));
