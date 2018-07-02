/*
if you are reading this: first of all, SORRY! second of all, i know there's a lot of behaviout that can be generalized and refactored im on it
*/

const postcss = require('postcss');
const Stringifier = require('postcss/lib/stringifier');
const xml = require('xml-parser');

const buildDeclGeneric = ({ content }) => {
	return new DeclProp(content);
};

const buildDeclAlternative = ({ content }) => {
	class DeclAlternativeProp extends DeclProp {
		constructor(prop) {
			super(prop);
			this.after = ', ';
		}
	}
	return new DeclAlternativeProp(content);
};

const buildDeclVar = ({ attributes }) => {
	return new DeclProp(`var(--${attributes.name})`);
};

const buildDeclCalc = ({ content }) => {
	return new DeclProp(`calc(${content.join(' ').trim()})`);
};

const buildDeclCalcProp = ({ attributes, content }) =>
	(attributes.operation ? [attributes.operation, content] : [content]).join(
		' '
	);

class DeclProp {
	constructor(prop) {
		this.after = ' ';
		this.trailing = false;
		this.prop = String(prop)
			.trim()
			.replace(/^\s+|\s+$/g, '');
	}
	toString({ index, length }) {
		return index === length && !this.trailing
			? this.prop
			: this.prop + this.after;
	}
}

const DeclContent = function(children) {
	const content = traverseDeclTree(children);
	const toString = () => content.join('');
	return { toString };
};

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

const buildDecl = ({ name, content, children = [] }) => {
	const value = new DeclContent(
		content
			? [
					{
						name: 'text',
						content,
					},
					...children,
			  ]
			: children
	).toString();

	children.length = 0;

	return postcss.decl({
		prop: name,
		value,
	});
};

const buildDefVar = ({ attributes, content }) => {
	return postcss.decl({
		prop: `--${attributes.name}`,
		value: content,
	});
};

const traverseDeclTree = xmlChildren => {
	const withDeclChildren = xmlItem => {
		if (xmlItem.children && xmlItem.children.length > 0) {
			xmlItem.content = traverseDeclTree(xmlItem.children);
			xmlItem.children.length = 0;
		} else {
			xmlItem.content = [xmlItem.content];
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
		getRule(xmlItem.name)(withDeclChildren(xmlItem)).toString({
			index,
			length: xmlChildren.length - 1,
		})
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
