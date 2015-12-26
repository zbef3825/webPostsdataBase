var mongoose = require('mongoose');
var fs = require('fs');

fs.readFile('./database/databaseadd1.txt','utf-8', function(err, data){
	if(err) throw err;
	var decrypt = new Buffer(data,'base64').toString('utf-8');
	mongoose.connect(decrypt, function(err) {
		if(err) throw err;
	});
});

var Schema = mongoose.Schema;
var dataAttributes = new Schema({
        scrapyName : String,
		postTitle : String,
		postUpvote : Number,
		postLink : String,
		commentLink : String,
		rankingPosition : String,
		lastUpdate : Number,
		postOrigin : String
});

var databaseModel = mongoose.model('webposts', dataAttributes);

module.exports = databaseModel;