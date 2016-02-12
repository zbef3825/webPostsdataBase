var databaseModel = require('./databaseModel.js');
var moment = require('moment');

module.exports = function databaseSearch(res, query, category, date, skip) {
		//searching database
		//pass in parameters for filter search
		var search = {};
		var result = {};
		var docSize = query.cnt || 12;
        var skipNum = skip || 0;
		
		if (docSize === 0) {
			//default value
			docSize = 12;
		}
		
		//requires pipline updates in the future
		if((!category || category === undefined) && ((!date || date === undefined) || date.length !== 8)) {
			search = {};
		}
		
		else if (((!date || date === undefined) || date.length !== 8)) {
			search = {
				postOrigin: category
			};		
		} 
		else {
			search = {postOrigin: category,
				lastUpdate: { $lt: Number(moment().format("YYYYMMDDHHmm"))}
                };
		}
        //finding documents using search condition
		//sort it by lastUpdate then post upvote
		//limitize document to 10 or any requested size
		//execute in sending documents to clients
        databaseModel
        .aggregate()
        .match(search)
        .limit(docSize)
        .skip(skipNum)
        .sort('-lastUpdate -postUpvote')
        .exec(function(err, docs) {
            if (err) {
                    return res.status(500).send("Error occured in GET databaseModel");
                }
                
            else if (docs[0] === undefined) {
                return res.status(404).send("No Result found!");
            }
            
            else {
                result.list = docs;
                return res.send(result);
            }
        });
};