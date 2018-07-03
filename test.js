const fs = require('fs');
const css = fs.readFileSync('demo/assets/css.xss', 'utf8');
const postcss = require('postcss');
const xss = require('./parser');

postcss()
	.process(css, { parser: xss })
	.then(function(result) {
		console.log(result.content);
	});
