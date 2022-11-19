const { Server } = require("socket.io");

class SocketServer {
	constructor(server) {
	  	const io = new Server(server, {
			cors: {
	  		origin: "*",
	  		methods: ["GET", "POST"],
			},
  		});

		io.on("connection", (socket) => {
			console.log("a user connected");

			socket.on("frame", frame => {
				onFrame(frame);
			});

			socket.on("disconnect", () => {
		  		console.log("user disconnected");
			});
		});

		console.log("✅ SocketServer initialized");
	}

	onFrame() {
		// io.emit("frame", frame);
	}
}

module.exports = SocketServer;