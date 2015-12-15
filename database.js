var bodyParser = require('body-parser');
var databaseModel = require('./databaseModel.js');
var json2csvFunc = require('./csvWrite.js');
var moment = require('moment');
var _ = require('underscore');
var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

var bodyParserJson = bodyParser.json();

var options = {
	//options for sending file. Root, dotfiles and headers are required
	root: path.join(__dirname),
	dotfiles: 'deny',
	header: {
		timestamp: moment()
	}
};

module.exports = function(app) {
	
	app.use(function(req, res, next) {
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

function databaseSave(data, category, res) {
	//saving data into MongoDB
	
	if (!data || category === undefined) {
		//if data is empty after json parse, response with 500 status
			return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
		}
	
	var request = databaseModel(_.extend(data, {lastUpdate: moment().format("ddd, MMM DD YYYY"), postOrigin: category}));
	//creating database model using function constructor
	//adding time and source properties
	
	request.save(function(err){
		//save the requested data and throw error if there is
			if (err) throw err;
		});
		
		return res.status(200).send(request + " saved!");
		//confirmation sign with 200 status		
	
}

function databaseSearch(res, query, category, date) {
	//searching database
	//pass in parameters for filter search
	var search = {};
	var docSize = query.cnt || 10;
	
	if (docSize === 0) {
		//default value
		docSize = 10;
	}
	
	//requires pipline updates in the future
	if((!category || category === undefined) && ((!date || date === undefined) || date.length !== 8)) {
		search = {};
	}
	
	else if (((!date || date === undefined) || date.length !== 8)) {
		search = {
			postOrigin: category
		};		
	} 
	else {
		search = {postOrigin: category,
			lastUpdate: moment(date,"YYYYMMDD").format("ddd, MMM DD YYYY")};
	}
	
	databaseModel
	.find(search)
	.limit(docSize)
	.exec(function(err, docs) {
		if (err) {
				return res.status(500).send("Error occured in GET databaseModel");
			}
			
			else if (docs[0] === undefined) {
				return res.status(404).send("No Result found!");
			}
			
			else {
				return res.send(docs);
			}		
		
	});
}

function databaseDownload (res) {
		json2csvFunc.checkFile(res)
		//check if csv file exists
		//this is only useful when starting server
	
		databaseModel.find({})
		.exec(function(err, docs) {
			
			//finding all webposts from mongoDB
		if (err) {
			res.status(500).send("Error occured in GET databaseModel");
		}
		else if (docs[0] === undefined) {
			res.status(404).send("No Result found!");
			}
		else {
			//when found convert json to csv
			json2csvFunc.writingCSVsending(res, docs, function() {
				//when it is done writing, invokes sending function
				res.sendFile('/temp/result.csv', options, function (err) {
				//sending file
				if (err) {
					console.error(err);
					throw err;
					}
				});	
			});	
		}		
	});
}