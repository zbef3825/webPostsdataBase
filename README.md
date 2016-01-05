# PWWT database server

## Usage
Development Heroku: calm-springs-9697.herokuapp.com

## API Instruction
1. Make a POST request through "calm-springs-9697.herokuapp.com/login"
a. Make sure Content-Type is application/json.
b. 'userID' and 'password' fields must be sent through (case sensitive).

```javascript
{
     "userID": [userID Name], 
     "password":[password]
}
```

2. If userID and password are valid, you will receive a token. Token will expire depending on userID.
a. If you are scrapy, you will receive 60 seconds to upload your data. Once the token is expired you will have to go through login process again.

3. You may now use a token as Header to make GET, POST requests throughout the server
a. Your Headers should contain "Content-Type" as "application/json" and "Authorization" as "Bearer Token"
b. GET '/api/all' to see all the web posts
c. GET '/api/:category' to see web posts of different category
d. GET '/api/:category/:date' to see web posts of different category on specific date(YYYMMDD)
e. GET '/api/download' to download all web posts in CSV file
f. POST '/api/save/:category' to upload webpost of :category

4. If you are scrapy and want to upload data, use following JSON schema:
```javascript
var dataAttributes = new Schema({
        scrapyName : String,
		postTitle : String,
		postUpvote : Number,
		postLink : String,
		commentLink : String,
		rankingPosition : String
});
```
a. All the attibutes must be included in JSON format as the server checks for the json validation
b. If you are uploading one web post at a time, make sure to send following JSON before AND after transmission:
Before:
```javascript
{
    "start": true,
    "scrapyName": [name]
}
```
After:
```javascript
{
    "end": true,
    "scrapyName": [name]
}
```
c. If you are uploading data in array, you do not need to send before and after
```javascript
[
    {
        "scrapyName" : [Name],
		"postTitle" : [Title],
		"postUpvote" : [Upvote],
		"postLink" : [linkaddress],
		"commentLink" : [linkaddress],
		"rankingPosition" : [Ranking]
    },
    {
        "scrapyName" : [Name],
		"postTitle" : [Title],
		"postUpvote" : [Upvote],
		"postLink" : [linkaddress],
		"commentLink" : [linkaddress],
		"rankingPosition" : [Ranking]
    }
]

```

d. When a scrapy performing POST request, it is impossible for other scrapys to interfere with POST operation. Please make sure your scrapy is timed

## To Do List

<ul>
<li>Pipeline/stream Data intake</li>
<li>Jasmine Test Module</li>
<li>Uploading Error Messages for multiple scrapy</li>
</ul>

## History

<ul>
<li>csv checking mechanism is required (Dec 6)</li>
<li>number of webposts GET request(Dec 15)</li>
<li>modified mongodb address(Dec 20)</li>
<li>Login Page(Dec 23)</li>
<li>JWT functionality(Dec 23)</li>
<li>Asynch duplication check(Dec 24)</li>
<li>Add update API (Dec 24)</li>
<li>Modification of WebPost save interface(Can now take single JSON or Array JSON (Dec 25)</li>
</ul>

