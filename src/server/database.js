const path = require('path');
const sqlite3 = require('sqlite3');
const bodyParser = require("body-parser");
require('dotenv').config();

const dbFile = path.join(__dirname, 'server', 'db', 'db.sqlite3');

class Database {
	constructor(app) {
		//this.db = new sqlite3.Database(dbFile);
		this.app = app;

		this.app.use(bodyParser.urlencoded({ extended: false }));

		this.app.get('/api/floorplan', (req, res) => {
			
		});

		this.app.post('/api/floorplan', (req, res) => {
			const floorplan = req.body.floorplan;
			console.log(floorplan);
			res.end('200');
		});
	}
}

module.exports = Database;