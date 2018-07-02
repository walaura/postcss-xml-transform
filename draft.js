const postcss = require('postcss');
const fs = require('fs');
const syntax = require('./lib/syntax.js');

const run = async () => {
	const css = await postcss([require('postcss-nested')]).process(
		fs.readFileSync('demo/assets/css.xss', 'utf8'),
		{
			syntax,
		}
	);
	console.log(css.css);
};

run();
