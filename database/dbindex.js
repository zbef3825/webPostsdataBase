var databaseSave = require('./dbsave.js');
var databaseSearch = require('./dbsearch.js');
var databaseDownload = require('./dbdownload.js');
var databaseLogin = require('./login.js');

var bodyParser = require('body-parser');
var bodyParserJson = bodyParser.json();

var expressJWT = require('express-jwt');
var jwt = require('jsonwebtoken');

module.exports = function(app) {
	
	
	
	app.use(function(req, res, next) {
	//COR handler
		res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Methods", "GET");
        res.header("Access-Control-Allow-Methods", "DELETE");
		res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
		next();
	});
	
	app.use(expressJWT({ 
		//checks token exist in the header and checks for bottom attributes
		secret: process.env.secretcode,
		userID: "scrapy" || "guest",
		issuer: "PWWT Server"
		})
		//does not check when users routes to homepage or login page
		.unless({path: ['/','/login']}));
	//Every route is protected with JWT authentication except homepage and login page
	

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
	
	app.post('/api/save/:category', bodyParserJson, function(req,res) {
		//checks if initial time and expiration time exists in req.user object
		if (!req.user.iat || !req.user.exp) {
			return res.status(401).send('Permission Denied');
		}
        
		//making sure log time is in between 30 mins for maximum uses
		// else if (Number(req.user.exp) - Number(req.user.iat) > 1801000) {
		// 	return res.status(401).send('Permission Denied');
		// }
        
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
		else {
			res.status(500).send("Internal Error. Contact Admin");
		}
		
	}	
}