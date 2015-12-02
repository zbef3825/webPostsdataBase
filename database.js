var bodyParser = require('body-parser');
var databaseModel = require('./databaseModel.js');

var bodyParserJson = bodyParser.json();


	
//var moment = require('moment');

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
		
	var request = databaseModel(data);
	//creating database model using function constructor
	
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
				console.error(err);
				res.status(500).send("Error occured in GET databaseModel");
			}
			else {
				console.log(docs);
				res.send(docs);
			}						
		});
	
}
