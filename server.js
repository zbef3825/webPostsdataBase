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

//var dbsave = require('./database/dbsave.js');

app.use(express.static(__dirname + '/public'));
dbindex(app);

var testdoc1 = [
{
    "_id": "567c353072dca4f4083bf6e7",
    "postTitle": "Example1",
    "postUpvote": 400,
    "postLink": "Example1",
    "commentLink": "Testing with Postman",
    "rankingPosition": "Testing with Postman",
    "postOrigin": "postman",
    "lastUpdate": 20151224,
    "__v": 0
},
{
    "_id": "567c353272dca4f4083bf6e9",
    "postTitle": "Example2",
    "postUpvote": 350,
    "postLink": "Example2",
    "commentLink": "Testing with Postman",
    "rankingPosition": "Testing with Postman",
    "postOrigin": "postman",
    "lastUpdate": 20151224,
    "__v": 0
},
{
    "_id": "567c353372dca4f4083bf6eb",
    "postTitle": "Example3",
    "postUpvote": 300,
    "postLink": "Example3",
    "commentLink": "Testing with Postman",
    "rankingPosition": "Testing with Postman",
    "postOrigin": "postman",
    "lastUpdate": 20151224,
    "__v": 0
}
];

testdoc2 = {
    "_id": "567c353372dca4f4083bf6eb",
    "postTitle": "Example3",
    "postUpvote": 300,
    "postLink": "Example3",
    "commentLink": "Testing with Postman",
    "rankingPosition": "Testing with Postman",
    "postOrigin": "postman",
    "lastUpdate": 20151224,
    "__v": 0
};

//dbsave(testdoc1);

    
 

app.listen(PORT);
//starting a server