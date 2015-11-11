'use strict';

module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const vars = root.find(j.VariableDeclaration)
      .filter(p => p.value.declarations.length > 1)
      .filter(p => p.parent.value.type === 'Program' || p.parent.value.type === 'BlockStatement');

  vars.forEach(p => {
    j(p).replaceWith(p.value.declarations.map((declaration, i) => {
      const d = j.variableDeclaration(p.value.kind, [declaration]);
      if (i == 0) {
        d.comments = p.value.comments;
      }
      return d;
    }));
  });

  return vars.size() > 0 ? root.toSource({ quote: 'single' }) : null;
};
