/*
if you are reading this: first of all, SORRY! second of all, i know there's a lot of behaviout that can be generalized and refactored im on it
*/

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

const buildAtRule = ({ attributes }) => postcss.atRule(attributes);

const buildRule = ({ attributes }) => postcss.rule(attributes);

const buildComment = ({ content }) =>
	postcss.comment({
		text: content,
	});

const buildDecl = ({ name, content, children }) => {
	if (children && children.length > 0) {
		content = traverseDeclTree(children).join('');
		children.length = 0;
	}
	return postcss.decl({
		prop: name,
		value: content,
	});
};

const buildDefVar = ({ attributes, content }) => {
	return postcss.decl({
		prop: `--${attributes.name}`,
		value: content,
	});
};

const buildDeclGeneric = ({ content }, index, length) => {
	return [[...content].join(''), index !== length ? ' ' : ''].join('');
};

const buildDeclAlternative = ({ content }, index, length) => {
	return [[...content].join(''), index !== length ? ', ' : ''].join('');
};

const buildDeclVar = ({ attributes }) => {
	return `var(--${attributes.name})`;
};

const buildDeclCalc = ({ content }) => {
	return `calc(${[...content].join(' ')})`;
};

const buildDeclCalcProp = ({ attributes, content }) =>
	(attributes.operation ? [attributes.operation, content] : [content]).join(
		' '
	);

const traverseDeclTree = xmlChildren => {
	const withDeclChildren = xmlItem => {
		if (xmlItem.children && xmlItem.children.length > 0) {
			xmlItem.content = traverseDeclTree(xmlItem.children);
			xmlItem.children.length = 0;
		}
		return xmlItem;
	};

	const getRule = name => {
		switch (name) {
			case 'var':
				return buildDeclVar;
			case 'calc':
				return buildDeclCalc;
			case 'calc-prop':
				return buildDeclCalcProp;
			case 'text':
				return buildDeclGeneric;
			case 'alternative':
				return buildDeclAlternative;
			default:
				return buildDeclGeneric;
		}
	};
	return xmlChildren.map((xmlItem, index) =>
		getRule(xmlItem.name)(
			withDeclChildren(xmlItem),
			index,
			xmlChildren.length - 1
		)
	);
};

const traverseTree = xmlChildren => {
	const getRule = name => {
		switch (name) {
			case 'def-var':
				return buildDefVar;
			case 'comment':
				return buildComment;
			case 'rule':
				return buildRule;
			case 'at-rule':
				return buildAtRule;
			default:
				return buildDecl;
		}
	};

	return xmlChildren.map(xmlItem => {
		const rule = getRule(xmlItem.name)(xmlItem);
		if (xmlItem.children && xmlItem.children.length > 0) {
			traverseTree(xmlItem.children).forEach(_ => rule.append(_));
		}
		return rule;
	});
};

const parse = contents => {
	const obj = xml(contents);
	const root = postcss.root();

	traverseTree(obj.root.children).forEach(_ => root.append(_));

	return root;
};

module.exports = {
	parse,
	stringify: (node, builder) => {
		let str = new Stringifier(builder);
		str.stringify(node);
	},
};

process.on('unhandledRejection', r => {
	console.error('#dfkfjks tracing unhandledRejection: ');
	console.error(r);
	process.kill(1);
});
