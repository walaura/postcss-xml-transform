const postcss = require('postcss');
const { withDeclarationHandling } = require('./syntax-declaration');
const { parseRuleWithChildren } = require('./util');

const buildAtRule = ({ attributes }) => postcss.atRule(attributes);

const buildRoot = () => postcss.root();

const buildRule = ({ attributes }) => postcss.rule(attributes);

const buildComment = ({ content }) =>
	postcss.comment({
		text: content,
	});

const buildDecl = ({ name, content, attributes }) =>
	postcss.decl({
		prop: name,
		value: content,
		important: attributes.important,
	});

const buildDefVar = ({ attributes, content }) =>
	postcss.decl({
		prop: `--${attributes.name}`,
		value: content,
	});

const ruleMapping = {
	style: buildRoot,
	'def-var': withDeclarationHandling(buildDefVar),
	comment: withDeclarationHandling(buildComment),
	rule: buildRule,
	'at-rule': buildAtRule,
	_: withDeclarationHandling(buildDecl),
};

const parseRuleXml = xmlItem => parseRuleWithChildren(xmlItem, ruleMapping);

module.exports = {
	parseRuleXml,
};
