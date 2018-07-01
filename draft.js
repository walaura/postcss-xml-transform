const postcss = require('postcss');
const fs = require('fs');
const syntax = require('./lib/syntax.js');

const run = async () => {
	const css = await postcss([require('postcss-nested')]).process(
		fs.readFileSync('style.htmlss', 'utf8'),
		{
			syntax,
		}
	);
	console.log(css.css);
};

run();
