var databaseModel = require('./databaseModel.js');
var moment = require('moment');
var _ = require('underscore');
var EventEmitter = require('events');

module.exports = function databaseSave(data, category, res) {
		//saving data into MongoDB
		
		if (!data || category === undefined) {
			//if data is empty after json parse, response with 500 status
				return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
			}
		
		var request = databaseModel(_.extend(data, {lastUpdate: Number(moment().format("YYYYMMDD")), postOrigin: category}));
		//creating database model using function constructor
		//adding timesstamp and source properties
		console.log(request);
		request.save(function(err){
			//save the requested data and throw error if there is
				if (err) throw err;
			});
			
			return res.status(200).send(request + " saved!");
			//confirmation sign with 200 status		
	};