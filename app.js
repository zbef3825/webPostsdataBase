var express = require('express');
var app = express();
//importing express framework

var port = process.env.PORT || 3000;
//setting up local port or current environment port

var database = require(__dirname +'/database.js');

database(app);


app.listen(port);
//starting a server