var dbModel = require('./databaseModel.js');
var moment = require('moment');

var dubDoc = {};

module.exports = function dbDub() {
    dubCheck();
}

function deleteDub(oidArray, resolveFN) {
    var promises = oidArray.map(function(dubID, index){
        return new Promise(function(resolve, reject){
            if(index !== 0) {
                dbModel
                .find({
                    _id: dubID
                })
                .remove()
                .exec(function(){
                    resolve();
                });
            }
            else {
                console.log("Keeping old value...");
                resolve();
            }
        });
    });
    
    var end = Promise.all(promises).then(function(){
        console.log("Duplication deleted!");
        return resolveFN();
    });
    return end;    
}

function dubCheck() {
    dbModel
    //aggregate framework for pulling data
    .aggregate()
    //matching with today (24 hours)
    .match({
        lastUpdate: { $gt: Number(moment().format("YYYYMMDDHHmm"))- 2000 }
        })
    //grouping them by post title and Link to look for duplication
    .group({
        _id: {
            postTitle: "$postTitle",
            postLink: "$postLink"
        },
        //Needs this data so we know the first array is the most updated and rest are old data
        //in order to have proper data order, we need keep the last data
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
    //returns promise object
    .exec()
    .then(function(doc){
        //console.log(doc);
        var dubPosts = doc.map(function(dubpost){
            return new Promise(function(resolve, reject) {
                var result = dbModel
                .find({
                    _id: dubpost.oid[dubpost.oid.length-1]
                })
                .exec();
                result.then(function(doc){
                    dbModel
                    .update({
                        _id: dubpost.oid[0]
                    }, {
                        postUpvote: doc[0].postUpvote
                    })
                    .exec();
                    //console.log("Updated old value to new value"); 
                    deleteDub(dubpost.oid, resolve);
                    
                }, function(err) {
                    if (err) {
                        reject(err);
                    }
                });
            });
        });
        
        Promise.all(dubPosts).then(function(){
            console.log("All Documents updated and deleted duplication!");                
        }, function(err){
            throw err;
        });   
    });
}