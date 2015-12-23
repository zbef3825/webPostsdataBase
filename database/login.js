var loginInfoMongoose = require('mongoose');
var loginConnection = loginInfoMongoose.createConnection('mongodb://scrapy:cheesecake@ds035485.mongolab.com:35485/logindb');
var Schema = loginInfoMongoose.Schema;
var loginAttributes = new Schema({
		userID: String,
		password: String
});
var loginModel = loginConnection.model('logininfos', loginAttributes);

module.exports = function databaseLogin(loginData, res) {
	loginModel.findOne({}, function(err, data) {
		if (err) console.error(err);
		if(loginData.userID === data.userID && loginData.password === data.password) {
			res.status(200).send({});
		}
		else {
			res.status(401).send();
		}
		loginInfoMongoose.connection.close();
	});	
}