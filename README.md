# PWWT database server

## Usage
Development Heroku: calm-springs-9697.herokuapp.com

## API Instruction
1. Make a POST request through "calm-springs-9697.herokuapp.com/login"
<p>1a. Make sure Content Type is JSON format.<p><br>
<p>1b. 'userID' and 'password' fields must be sent through (case sensitive).<p><br>
<p>1c. Example {"userID": [userID Name], "password":[password]} <p><br>
2. If userID and password are valid, you will receive a token. Token will be expired depending on userID.
<p>2a. If you are scrapy, you will receive 60 seconds to upload your data. Once the token is expired you will have to go through login process again.<p><br>
3. You may now use a token to make GET request throughout the server
<p>4a. GET '/api/all' to see all the web posts<p><br>
<p>4b. GET '/api/:category' to see web posts of different category<p><br>
<p>4c. GET '/api/:category/:date' to see web posts of different category on specific date(YYYMMDD)<p><br>
<p>4d. GET '/api/download' to download all web posts in CSV file<p><br>
<p>4e. POST '/api/save/:category' to upload webpost of :category<p><br>

## To Do List

<ul>To do
<li>Pipeline/stream Data intake</li>
<li>Jasmine Test Module</li>
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

