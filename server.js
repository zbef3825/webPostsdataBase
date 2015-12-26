var express = require('express');
var crypto = require('crypto');
var app = express();

//setting up local port or current environment port
var PORT = process.env.PORT || 3000;

//setting secretcode for authentication
process.env.secretcode =  crypto.randomBytes(256);
process.env.enter = true;
process.env.scrapyName = null;

var dbindex = require('./database/dbindex.js');

app.use(express.static(__dirname + '/public'));
dbindex(app);

app.listen(PORT);
//starting a server