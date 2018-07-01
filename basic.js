const postcss = require('postcss');
const fs = require('fs');
const syntax = require('./lib/syntax.js');

const run = async () => {
	const css = await postcss().process(fs.readFileSync('style.htmlss', 'utf8'), {
		syntax,
	});
	console.log(css.css);
};

run();
