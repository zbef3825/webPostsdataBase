var databaseModel = require('./databaseModel.js');
var moment = require('moment');
var json2csvFunc = require('./csvWrite.js');
var path = require('path');

var options = {
	//options for sending file. Root, dotfiles and headers are required
	root: path.join(__dirname),
	dotfiles: 'deny',
	header: {
		timestamp: moment()
	}
};

module.exports = function databaseDownload (res) {
			json2csvFunc.checkFile(res)
			//check if csv file exists
			//this is only useful when starting server
		
			//finding documents using search condition
			//sort it by lastUpdate then post upvote
			databaseModel.find({})
			.sort('-lastUpdate -postUpvote')
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
	};