var bodyParser = require('body-parser');
var databaseModel = require('./databaseModel.js');
var moment = require('moment');
var _ = require('underscore');

var bodyParserJson = bodyParser.json();

module.exports = function(app) {
	
	app.use('/database',databaseError);
	//error handling middleware
	
	app.get('/database/', function(req, res) {
		//prints out posts	
		databaseSearch(res);
	});
	
	app.post('/database/:category', bodyParserJson, function(req,res) {	
		//storing data of :category				
		databaseSave(req.body, req.params.category, res);			
	});
	
	function databaseError(err, req, res, next){
		//database error handling function
		console.error(err.stack);
		res.status(500).send("Error occured in database.js");
	}
	
		
	
}

function databaseSave(data, category, res) {
	//saving data into MongoDB
	
	if (!data || category === undefined) {
		//if data is empty after json parse, response with 500 status
			return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
		}
	
	var request = databaseModel(_.extend(data, {lastUpdate: moment().format("ddd, MMM Do YYYY"), postOrigin: category}));
	//creating database model using function constructor
	//adding time and source properties
	
	request.save(function(err){
		//save the requested data and throw error if there is
			if (err) throw err;
		});
		
		return res.status(200).send(request + " saved!");
		//confirmation sign with 200 status		
	
}

function databaseSearch(res) {
	//searching database
	//pass in parameters for filter search
	
	//requires pipline updates in the future
		databaseModel.find({}, function(err, docs){
			if (err) {
				res.status(500).send("Error occured in GET databaseModel");
			}
			else {
				res.send(docs);
			}						
		});
	
}
