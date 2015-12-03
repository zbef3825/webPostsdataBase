var express = require('express');
var app = express();
//importing express framework

var PORT = process.env.PORT || 3000;
//setting up local port or current environment port

var database = require('./database.js');

app.use(express.static(__dirname + '/public'));

database(app);


app.listen(PORT);
//starting a server