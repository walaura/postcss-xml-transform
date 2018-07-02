/*
if you are reading this: first of all, SORRY! second of all, i know there's a lot of behaviout that can be generalized and refactored im on it
*/

const postcss = require('postcss');
const Stringifier = require('postcss/lib/stringifier');
const xml = require('xml-parser');

class DeclRule {
	constructor({
		after = ' ',
		before = '',
		isTrailing = false,
		children = [],
		attributes = {},
		render = ({ children }) => children.join(''),
	}) {
		this.after = after;
		this.before = before;
		this.isTrailing = isTrailing;
		this.children = children;
		this.attributes = attributes;
		this.render = render;
	}

	append(item) {
		this.children.push(item);
	}

	toString({ index = 0, length = 0 } = {}) {
		const prop = this.render({
			attributes: this.attributes,
			children: this.children.map((child, _index) =>
				child.toString({ index: _index, length: this.children.length - 1 })
			),
		});
		return (
			this.before +
			(index === length && !this.isTrailing ? prop : prop + this.after)
		);
	}
}

const buildDeclText = ({ content }) => {
	return new DeclRule({
		children: [content],
	});
};

const buildDeclGeneric = () => {
	return new DeclRule({});
};

const buildDeclAlternative = () => {
	return new DeclRule({
		after: ', ',
	});
};

const buildDeclVar = ({ attributes }) => {
	return new DeclRule({
		attributes,
		render: ({ attributes }) => `var(--${attributes.name})`,
	});
};

const buildDeclCalc = () => {
	return new DeclRule({
		render: ({ children }) => `calc(${children.join('').trim()})`,
	});
};

const buildDeclCalcProp = ({ attributes }) => {
	return new DeclRule({
		before: attributes.operation ? attributes.operation + ' ' : '',
		render: ({ children }) => {
			return children.join('');
		},
	});
};

const buildAtRule = ({ attributes }) => postcss.atRule(attributes);

const buildRule = ({ attributes }) => postcss.rule(attributes);

const buildComment = ({ children }) => {
	const rt = postcss.comment({
		text: xmlRuleToAstRule({ children }).toString(),
	});
	if (children) children.length = 0;
	return rt;
};

const buildDecl = ({ name, children }) => {
	const rt = postcss.decl({
		prop: name,
		value: xmlRuleToAstRule({ children }).toString(),
	});
	if (children) children.length = 0;
	return rt;
};

const buildDefVar = ({ attributes, children }) => {
	const rt = postcss.decl({
		prop: `--${attributes.name}`,
		value: xmlRuleToAstRule({ children }).toString(),
	});
	if (children) children.length = 0;
	return rt;
};

const contentToTextNode = xmlItem => {
	if (xmlItem.name !== 'text' && xmlItem.content) {
		if (!xmlItem.children) xmlItem.children = [];
		xmlItem.children.push({
			name: 'text',
			content: xmlItem.content,
		});
		xmlItem.content = null;
	}
	return xmlItem;
};

const xmlRuleToAstRule = xmlItem => {
	const getRule = name => {
		switch (name) {
			case 'var':
				return buildDeclVar;
			case 'calc':
				return buildDeclCalc;
			case 'calc-prop':
				return buildDeclCalcProp;
			case 'text':
				return buildDeclText;
			case 'alternative':
				return buildDeclAlternative;
			default:
				return buildDeclGeneric;
		}
	};

	const rule = getRule(xmlItem.name)(xmlItem);
	xmlItem = contentToTextNode(xmlItem);
	if (xmlItem.children && xmlItem.children.length > 0) {
		traverseXmlDeclTree(xmlItem.children).forEach(_ => {
			rule.append(_);
		});
	}
	return rule;
};

const traverseXmlDeclTree = xmlChildren => {
	return xmlChildren.map(xmlItem => xmlRuleToAstRule(xmlItem));
};

const traverseXmlTree = xmlChildren => {
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
		xmlItem = contentToTextNode(xmlItem);
		const rule = getRule(xmlItem.name)(xmlItem);
		if (xmlItem.children && xmlItem.children.length > 0) {
			traverseXmlTree(xmlItem.children).forEach(_ => {
				rule.append(_);
			});
		}
		return rule;
	});
};

const parse = contents => {
	const obj = xml(contents);
	const root = postcss.root();

	traverseXmlTree(obj.root.children).forEach(_ => root.append(_));

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
	console.error(r);
	process.kill(1);
});
