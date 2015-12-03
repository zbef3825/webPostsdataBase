var mongoose = require('mongoose');

mongoose.connect("mongodb://webserver:webserver@ds047930.mongolab.com:47930/link_agg");

var Schema = mongoose.Schema;
var dataAttributes = new Schema({
		postTitle : String,
		postUpvote : String,
		postLink : String,
		commentLink : String,
		rankingPosition : String,
		lastUpdate : String,
		postOrigin : String
});

var databaseModel = mongoose.model('webposts', dataAttributes);

module.exports = databaseModel;