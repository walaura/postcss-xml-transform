require('dotenv').config();
const express = require('express');
const postcss = require('postcss');
const fs = require('fs');
const syntax = require('./../lib/syntax.js');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json()); // support json encoded bodies
app.use(bodyParser.urlencoded({ extended: true })); // support encoded bodies
app.use(express.static(__dirname));

app.get('/assets/css.css', async function(request, response) {
	const css = await postcss().process(
		fs.readFileSync(__dirname + '/assets/css.xss', 'utf8'),
		{
			syntax,
		}
	);
	response.send(css.css);
	response.end();
});

app.get('/', function(request, response) {
	response.sendFile(__dirname + '/index.html');
});

app.post('/parse', async function(request, response) {
	const css = await postcss().process(request.body.value, {
		syntax,
	});
	response.send(css.css);
	response.end();
});

var listener = app.listen(process.env.PORT, function() {
	console.log('Your app is listening on port ' + listener.address().port);
});
