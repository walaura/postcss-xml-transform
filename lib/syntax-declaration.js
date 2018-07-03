const { parseRuleWithChildren } = require('./util');

class Declaration {
	constructor({
		after = ' ',
		before = '',
		isTrailing = false,
		children = [],
		render = content => content,
	}) {
		this.after = after;
		this.before = before;
		this.isTrailing = isTrailing;
		this.children = children;
		this.render = render;
	}

	append(item) {
		this.children.push(item);
	}

	toString({ index = 0, length = 0 } = {}) {
		const prop = this.render(
			this.children
				.map((child, _index) =>
					child.toString({ index: _index, length: this.children.length - 1 })
				)
				.join('')
		);
		return (
			this.before +
			(index === length && !this.isTrailing ? prop : prop + this.after)
		);
	}
}

const buildDeclText = ({ content }) =>
	new Declaration({
		children: [content],
	});

const buildDeclGeneric = () => new Declaration({});

const buildDeclAlternative = () =>
	new Declaration({
		after: ', ',
	});

const buildDeclVar = ({ attributes }) =>
	new Declaration({
		render: () => `var(--${attributes.name})`,
	});

const buildDeclCalc = () =>
	new Declaration({
		render: content => `calc(${content})`,
	});

const buildDeclCalcProp = ({ attributes }) =>
	new Declaration({
		before: attributes.operation ? attributes.operation + ' ' : '',
	});

const ruleMapping = {
	var: buildDeclVar,
	calc: buildDeclCalc,
	'calc-prop': buildDeclCalcProp,
	text: buildDeclText,
	alternative: buildDeclAlternative,
	_: buildDeclGeneric,
};

const parseRuleXml = xmlItem => parseRuleWithChildren(xmlItem, ruleMapping);

const withDeclarationHandling = fn => xmlItem => {
	if (xmlItem.children) xmlItem.content = parseRuleXml(xmlItem).toString();
	return fn(xmlItem);
};

module.exports = { withDeclarationHandling };
