const Stringifier = require('postcss/lib/stringifier');
const xml = require('xml-parser');
const { parseRuleXml } = require('./lib/syntax-postcss');

module.exports = {
	parse: contents => parseRuleXml(xml(contents).root),
	stringify: (node, builder) => {
		let str = new Stringifier(builder);
		str.stringify(node);
	},
};

process.on('unhandledRejection', r => {
	console.error(r);
	process.kill(1);
});
