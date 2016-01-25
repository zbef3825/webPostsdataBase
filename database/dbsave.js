var databaseModel = require('./databaseModel.js');
var dubCheck = require('./dbDub.js');

var moment = require('moment');
var _ = require('underscore');


//saving data into MongoDB
module.exports = function databaseSave(data, category, res) {
    //if data is empty after json parse, response with 500 status
    if (!data || category === undefined) {
        return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
    }
    
    //checking if data is object array. If so parsing is required
    if (Object.prototype.toString.call(data) === "[object Array]")   {
        //goes through each elements in Array to see if it has valid key/values
        var numPost = 0;
        
        var promise = data.map(function(list, index) {
            return new Promise(function(resolve, reject) {
                if(!list.hasOwnProperty("postTitle") && !list.hasOwnProperty("postLink")) {
                    reject();
                }
                else {
                    var request = databaseModel(_.extend(list, {lastUpdate: Number(moment().format("YYYYMMDDHHmm")), postOrigin: category}));
                    numPost += 1;
                    //save the requested data and throw error if there is
                    request.save(function(err){
                        if (err) throw err;
                        console.log("Saving...");
                        resolve();
                        });  
                    }
            });    
        });        
        
        Promise.all(promise)
        .then(function() {
            console.log("Uploading Complete! Checking for Duplication");
            //at the end of upload checking duplication check
            dubCheck();
            //confirmation sign with 200 status
            return res.status(200).send(numPost + " web posts saved!");
            
        }, function(){
            return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
        });
    }
    
    //checking if data is singular Object
    else if (Object.prototype.toString.call(data) === "[object Object]") {
        //for first scrapy entering, it checks for start & end attributes
        //if json has start attributes as true, it will log its name and change .enter value as false and send 200 res
        if(process.env.enter === "true") {
            if(data.hasOwnProperty("start") && data.start === true && data.hasOwnProperty("scrapyName")) {
                process.env.scrapyName = data.scrapyName;
                process.env.enter = "false";
                return res.status(200).send("You are ready to upload data");
            }
            
            //if .enter is true but wasnt able to find start attribute as true, it will send out error message
            else {
                return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
            }
        }
        
        //this is when .enter value is false
        //if the same scrapy entered, it will upload whatever json file it's sending
        //if it is not the same scrapy entered, send 500 res
        else {
            
            //if it detects end attributes and true, it will set .name as null and .enter as true so other scrapy can enter
            if (data.hasOwnProperty("end") && data.end === true && (process.env.scrapyName === data.scrapyName)) {
                process.env.scrapyName = null;
                process.env.enter = true;
                //at the end of upload checking duplication check
                dubCheck();
                return res.status(200).send("Scrapy is detached!");
            }
            else if(!data.hasOwnProperty("start") && !data.hasOwnProperty("end") && process.env.scrapyName === data.scrapyName) {
                var request = databaseModel(_.extend(data, {lastUpdate: Number(moment().format("YYYYMMDDHHmm")), postOrigin: category}));
                //save the requested data and throw error if there is
                request.save(function(err){
                    if (err) throw err;
                    });
            }
            else {
                return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
            }
            return res.status(200).send("webpost saved!");                       
        }        
    } 
    else {
        return res.status(500).send("Error occured in POST database: Incorrect JSON file/format");
    }
};
    
    