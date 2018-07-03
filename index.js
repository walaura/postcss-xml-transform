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
