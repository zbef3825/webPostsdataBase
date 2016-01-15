var loginInfoMongoose = require('mongoose');
var jwt = require('jsonwebtoken');
var fs = require('fs');

var loginModel;

fs.readFile('./database/databaseadd2.txt','utf-8', function(err, data){
	if(err) throw err;
	var decrypt = new Buffer(data,'base64').toString('utf-8');
	//connection to login database
	var loginConnection = loginInfoMongoose.createConnection(decrypt, function(err) {
		if(err) throw err;
		//Attribute Schema(Expected values and type)
		var Schema = loginInfoMongoose.Schema;
		var loginAttributes = new Schema({
				userID: String,
				password: String
		});	
		loginModel = loginConnection.model('logininfos', loginAttributes);
	});
});

//database login method used in dbindex.js
module.exports = function databaseLogin(loginData, res) {
	var timeExp;
	loginModel.find({userID: loginData.userID}, function(err, data) {
		//Checking if there is multiple ID result. This would be internal Error and if this occurs, bug needs to be fixed
		if (data[1]) {
			res.status(500).send("Internal Error. Please Contact Admin");
		}
		//Checking to see if there is any data associated with userID
		//If no result was found, data is empty
		else if (err || data[0] === undefined || data[0] === null) {
			res.status(401).send("USERNAME OR PASSWORD IS INCORRECT");
		}
		//checking if login password is same as database login info
		else if(data[0].password === loginData.password) {
			//determining the time expiration of token depending on login ID
			switch (loginData.userID) {
                case "admin":
                    timeExp = "600m";
                    break;
				case "scrapy":
					timeExp = "300s";
					break;
				case "guest":
					timeExp = "30m";
					break;
				default:
					timeExp = "0";					
			}
			var token = jwt.sign({
				userID: loginData.userID,
				}, 
				process.env.secretcode, 
				{
					issuer: "PWWT Server",
					expiresIn: timeExp
			});
			res.status(200).send({
                token: token
            });
		}
		//returning incorrect username or password message
		else {
			res.status(401).send("USERNAME OR PASSWORD IS INCORRECT");
		}
		//close connection for optimzation
		//loginInfoMongoose.connection.close();
	});	
}