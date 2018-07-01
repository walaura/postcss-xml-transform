const postcss = require('postcss');
const Stringifier = require('postcss/lib/stringifier');
const xml = require('xml-parser');

const parse = contents => {
	const obj = xml(contents);
	const root = postcss.root();

	const attachChildrenToRule = (rule, children) => {
		for (let { name, content } of children) {
			rule.append({
				prop: name,
				value: content,
			});
		}
	};

	const ruleToCss = node => {
		const rule = postcss.rule({
			selector: node.attributes.selector,
		});
		attachChildrenToRule(rule, node.children);
		root.append(rule);
	};

	obj.root.children.map(ruleToCss);

	return root;
};

module.exports = {
	parse,
	stringify: (node, builder) => {
		let str = new Stringifier(builder);
		str.stringify(node);
	},
};
