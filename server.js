const express = require('express');
const fs = require('fs');
const parseHtmlss = require('./htmlss-parser.js')
var app = express(); 


app.get('/style.css', function(request, response) {
  response.writeHead(200, {"Content-Type": "text/css"});
  response.write(
    parseHtmlss(fs.readFileSync('style.htmlss', 'utf8'))
  );
  response.end();
});

app.get('/', function(request, response) {
  response.sendFile(__dirname + '/views/index.html');
});

var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
