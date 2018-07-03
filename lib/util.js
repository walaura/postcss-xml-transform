const contentToTextNode = xmlItem => {
	if (xmlItem.name !== 'text' && xmlItem.content) {
		if (!xmlItem.children) xmlItem.children = [];
		xmlItem.children.push({
			name: 'text',
			content: xmlItem.content.trim(),
		});
		xmlItem.content = null;
	}
	return xmlItem;
};

const findRule = (ruleMapping, name) =>
	ruleMapping[name] ? ruleMapping[name] : ruleMapping._;

const applyRule = ruleMapping => xmlItem =>
	findRule(ruleMapping, xmlItem.name)(xmlItem);

const parseRuleWithChildren = (xmlItem, ruleMapping) => {
	xmlItem = contentToTextNode(xmlItem);
	const rule = applyRule(ruleMapping)(xmlItem);
	while (xmlItem.children && xmlItem.children.length) {
		rule.append(parseRuleWithChildren(xmlItem.children.shift(), ruleMapping));
	}
	return rule;
};

module.exports = { parseRuleWithChildren };
