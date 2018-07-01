const postcss = require('postcss');
const Stringifier = require('postcss/lib/stringifier');
const xml = require('xml-parser');

const ruleToCss = node => {
	const rule = postcss.rule({
		selector: node.attributes.selector,
	});
	attachChildrenToRule(rule, node.children);
	root.append(rule);
};

const buildAtRule = ({ attributes }) => {
	return postcss.atRule(attributes);
};

const buildRule = ({ attributes }) => {
	return postcss.rule({
		selector: attributes.selector,
	});
};

const buildDecl = ({ name, content }) => {
	return postcss.decl({
		prop: name,
		value: content,
	});
};

const traverseTree = (parent, xmlChildren) => {
	for (const xmlItem of xmlChildren) {
		const getRule = name => {
			if (name === 'rule') {
				return buildRule;
			} else if (name === 'at-rule') {
				return buildAtRule;
			} else {
				return buildDecl;
			}
		};
		const rule = getRule(xmlItem.name)(xmlItem);
		parent.append(rule);
		if (xmlItem.children) {
			traverseTree(rule, xmlItem.children);
		}
	}
};

const parse = contents => {
	const obj = xml(contents);
	const root = postcss.root();

	traverseTree(root, obj.root.children);

	return root;
};

module.exports = {
	parse,
	stringify: (node, builder) => {
		let str = new Stringifier(builder);
		str.stringify(node);
	},
};
