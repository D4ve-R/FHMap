const sqlite3 = require('sqlite3');
require('dotenv').config();

const dbFile = path.join(__dirname, 'db', 'db.sqlite3');


function Database() {
	return new sqlite3.Database('db.sqlite3');
}

module.exports = Database;