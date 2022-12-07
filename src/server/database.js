const path = require('path');
const { MongoClient } = require('mongodb');

require('dotenv').config();

function getRouteFactory(app, url, param, collection) {
	app.get(url, (req, res) => {
		const id = req.query[param];
		if(id) {
			collection.findOne({id: id}).then(function(result){
				if(result)
					res.status(200).json(result);
				else
					res.status(404).json({error: 'Not found id: ' + id});
			});
		}
		else {
			res.status(400).json({error: 'No id provided'});
		}
	});
}

class Database {
	prefix = '/api';
	constructor(app, prefix) {
		prefix = prefix || this.prefix;
		const client = new MongoClient(process.env.DB_URI);
		client.connect().then(function(){
			const dbName = process.env.DB_NAME || 'test';
			this.db = client.db(dbName);
			this.col = this.db.collection('test');
			this.roomData = this.db.collection('roomdata');
			console.log('✅ Connected to database ' + dbName);
			console.log('routes available at ' + prefix);
		}.bind(this));

		//getRouteFactory(app, prefix+'/roomdata', 'id', this.roomData);
		getRouteFactory(app, prefix+'/floorplan', 'id', this.col);

		app.get(prefix+'/roomdata', (req, res) => {
			this.roomData.findOne().then(function(result){
					if(result)
						res.status(200).json(result);
					else
						res.status(404).json({error: 'Not found'});
				});
			
		});

		app.post(prefix+'/floorplan', (req, res) => {
			this.col.insertOne(req.body);
			const floorplan = req.body;
			res.status(201).json(floorplan._id);
		});	
	}
}

module.exports = Database;