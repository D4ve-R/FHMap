const { createProxyMiddleware } = require('http-proxy-middleware');

const DEM_API_SERVICE_URL = process.env.DEM_API_SERVICE_URL;

const proxyOptions = {
	target: DEM_API_SERVICE_URL,
	changeOrigin: true,
	pathRewrite: {
		'^/dem': '/'
	},
	logger: console,
	on: {
		proxyReq: (proxyReq, req) => {
			let x = req.query.x;
			let y = req.query.y;
			let z = req.query.z;

			if(!x && !y && !z) {
				res.status(400).send("Missing x, y, or z query parameter");
				return;
			}
			proxyReq.path += `${z}/${x}/${y}.png`;
		}
	}
};


class DEMProxy {
	constructor(app) {
		this.app = app

		console.log("✅ DEMProxy is running");
		const proxy = createProxyMiddleware(proxyOptions);
		this.app.use("/dem", proxy);
	}
}

module.exports = DEMProxy;