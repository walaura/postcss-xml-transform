const xml = require('xml-parser');
const postcss = require('postcss');

const parse = (contents) => {
  const obj = xml(contents);
  const root = postcss.root();
  
  const attachChildrenToRule = (rule,children) => {
    for (let {name, content} of children) {
      rule.append({
        prop: name,
        value: content
      });
    }
  }
  
  const ruleToCss = (node) => {
    const rule = postcss.rule({
      selector: node.attributes.selector
    });
    attachChildrenToRule(rule, node.children);
    root.append(rule);
  }
  
  obj.root.children.map(ruleToCss);

  return root.toString();

}

module.exports = parse;