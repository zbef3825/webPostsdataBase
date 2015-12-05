var json2csv = require('json2csv');
var fs = require('fs');
var path = require('path');

function CSVFILE(res, docs) {
	
	var file;
	var fields = ['postTitle', 'postUpvote', 'postLink', 'commentLink', 'rankingPosition', 'lastUpdate', 'postOrigin'];
	//fields that required by json2csv module
	
	this.writingCSVsending = function(res, docs, callback) {
		json2csv({data: docs, fields: fields}, function(err, csv) {
			if (err) {
				console.error(err);
				return res.status(500).send("Error converting to CSV format");
			}
			fs.writeFileSync(path.join(__dirname + '/temp/result.csv'), csv);
			callback();
			});	
		
	};
	
	this.checkFile = function(res) {		
			fs.Stats(path.join(__dirname + '/temp/result.csv'),function(err, stats) {
			//checking if result.csv exists before writing
			if (err) {
				console.error(err);
				return res.status(500).send("Error checking csv file");
			}
			if (!stats.isFile()) {
			//if it doesnt exists, write the file
			console.log("Initiating result.csv file!");
			fs.writeFile(path.join(__dirname + '/temp/result.csv'), "Initiated", function(err) {
				if (err) {
					console.error(err);
					return res.status(500).send("Error initiating csv file");;
				}
			});		
			}
		});	
		
	};
};

module.exports = new CSVFILE();