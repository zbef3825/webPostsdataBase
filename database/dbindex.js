var databaseSave = require('./dbsave.js');
var databaseSearch = require('./dbsearch.js');
var databaseDownload = require('./dbdownload.js');
var databaseLogin = require('./login.js');

var bodyParser = require('body-parser');
var bodyParserJson = bodyParser.json();

var expressJWT = require('express-jwt');

module.exports = function(app) {
	
	
	
	app.use(function(req, res, next) {
	//COR handler
		res.header("Access-Control-Allow-Origin", "*");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});

	app.use('/api',databaseError);
	//error handling middleware
	
	app.get('/api/all', function(req, res) {
		//prints out all posts	
		databaseSearch(res, req.query);
	});
	
	app.get('/api/download', function(req, res) {
		databaseDownload(res);
	});
	
	app.get('/api/:category', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.query, req.params.category);
	});
	
	app.get('/api/:category/:date', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.query, req.params.category, req.params.date);
	});
	
	app.post('/api/save/:category', [expressJWT({ secret:"Cheesecake"}), bodyParserJson], function(req,res) {
		//storing data of :category				
		databaseSave(req.body, req.params.category, res);			
	});
	
	app.post('/login', bodyParserJson, function (req, res) {
		databaseLogin(req.body, res);			
	});
	
	function databaseError(err, req, res, next){
		//database error handling function
		if (err.name === "UnauthorizedError") {
			res.status(401).send('Permission Denied');
		}
		res.status(500).send("Contact Admin (Error1)");
	}	
}