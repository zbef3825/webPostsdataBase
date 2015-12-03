var bodyParser = require('body-parser');
var databaseModel = require('./databaseModel.js');
var moment = require('moment');
var _ = require('underscore');
var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

var bodyParserJson = bodyParser.json();

module.exports = function(app) {
	
	app.use('/database',databaseError);
	//error handling middleware
	
	app.get('/database', function(req, res) {
		//prints out all posts	
		databaseSearch(res);
	});
	
	app.get('/database_download', function(req, res) {
		databaseDownload(res);
	});
	
	app.get('/database/:category', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.params.category);
	});
	
	app.get('/database/:category/:date', function(req, res) {
		//prints out all posts of :category	
		databaseSearch(res, req.params.category, req.params.date);
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

function databaseSearch(res, category, date) {
	//searching database
	//pass in parameters for filter search
	var search = {};
	
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
	
	databaseModel.find(search, function(err, docs){
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
	
	var fields = ['postTitle', 'postUpvote', 'postLink', 'commentLink', 'rankingPosition', 'lastUpdate', 'postOrigin'];
	//fields that required by json2csv module
	
	databaseModel.find({}, function(err,docs) {
		//finding all webposts from mongoDB
		if (err) {
			return res.status(500).send("Error occured in GET databaseModel");
		}
		else if (docs[0] === undefined) {
			return res.status(404).send("No Result found!");
			}
		else {
			//if docs is not empty convert json to csv and write a file in Donwload folder
			json2csv({data: docs, fields: fields}, function (err, csv){
			if (err) console.error(err);	
			fs.writeFile(__dirname + "/Download/result.csv", csv, function (err){
				if(err) throw err;
					});
				});
			}	
	});
	
	
	var options = {
		//options for sending file. What is required
		root: path.join(__dirname + '/Download'),
		dotfiles: 'deny',
		header: {
			timestamp: moment()
		}
	};
	
	res.sendFile('result.csv', options, function (err) {
		//sending file
		if (err) {
			throw err;
		}
	});
	
	
}
