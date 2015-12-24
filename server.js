var express = require('express');
var crypto = require('crypto');
var app = express();

var test = require('./database/dbDub.js');

//setting up local port or current environment port
var PORT = process.env.PORT || 3000;

//setting secretcode for authentication
process.env.secretcode =  crypto.randomBytes(256);

var dbindex = require('./database/dbindex');

app.use(express.static(__dirname + '/public'));
dbindex(app);

test();

app.listen(PORT);
//starting a server