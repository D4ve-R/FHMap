const { createProxyMiddleware } = require('http-proxy-middleware');

const DEM_API_SERVICE_URL = process.env.DEM_API_SERVICE_URL;

class DEMProxy {
	constructor(app) {
		this.app = app

		this.app.get("/dem/x/:x/y/:y/z/:z", createProxyMiddleware({
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
	}
}

module.exports = DEMProxy;