var dbModel = require('./databaseModel.js');
var moment = require('moment');

var dubDoc = {};

module.exports = function dbDub() {
    dbModel
    //aggregate framework for pulling data
    .aggregate()
    //matching with today date
    .match({
        lastUpdate: Number(moment().format("YYYYMMDD"))
        })
    //grouping them by post title and Link to look for duplication
    .group({
        _id: {
            postTitle: "$postTitle",
            postLink: "$postLink"
        },
        //Needs this data so we know the first array is the most updated and rest are old data
        oid: {
            $push: "$_id"
        },
        //Counting how many duplicated documents. Lowest value is 1
        count: {
            "$sum": 1
        }
    })
    //count that is higher than 1 is considered as duplication
    .match({
        count: {
            "$ne": 1
            }
    })
    .exec(function(err,doc) {
        if (err) throw err;
        dubDoc['lists'] = doc
        for (var list in dubDoc.lists) {
            dubDoc.lists[list].oid.forEach( function(dubid,index){
                if (index !== 0) {
                    dbModel
                    .find({
                        _id: dubid
                    })
                    .remove()
                    .exec( function(err, doc){
                        if (err) throw err;
                    });
                }
            });            
        }       
    });
};