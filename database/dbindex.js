var bodyParser = require('body-parser');
var databaseSave = require('./dbsave.js');
var databaseSearch = require('./dbsearch.js');
var databaseDownload = require('./dbdownload.js');
var bodyParserJson = bodyParser.json();

module.exports = function(app) {
	
	app.use(function(req, res, next) {
	//COR handler
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.use('/database',databaseError);
	//error handling middleware
	
	app.get('/database', function(req, res) {
		//prints out all posts	
		databaseSearch(res, req.query);
	});
	
	app.get('/database/download', function(req, res) {
		databaseDownload(res);
	});
	
	app.get('/database/:category', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.query, req.params.category);
	});
	
	app.get('/database/:category/:date', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.query, req.params.category, req.params.date);
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