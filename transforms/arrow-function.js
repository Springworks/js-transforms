'use strict';

const helpers = require('./common/helpers');


module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const modified = helpers.createChangeTracker();

  transformBoundFunctionExpressions(j, modified, root);

  const function_expressions = root.find(j.FunctionExpression)
      .filter(p => !isNamedFunctionExpression(p) &&
                   !isMemberAssignment(p) &&
                   !isMethodProperty(p) &&
                   !helpers.containsThisExpression(j, p) &&
                   !helpers.containsArgumentsIdentifier(j, p));

  function_expressions.replaceWith(p => helpers.createArrowFunctionExpression(j, p.value));

  modified(function_expressions.size() > 0);

  return modified() ? root.toSource({ quote: 'single' }) : null;
};


function isNamedFunctionExpression(function_expr) {
  return !!function_expr.value.id;
}


function isMemberAssignment(path) {
  const p = path.parentPath;
  return !!p && p.value.type === 'AssignmentExpression' && p.value.left.type === 'MemberExpression';
}


function isMethodProperty(path) {
  const p = path.parentPath;
  return !!p && p.value.type === 'Property' && p.value.method === true;
}


function transformBoundFunctionExpressions(j, modified, root) {
  const bound = root.find(j.CallExpression, {
    callee: {
      type: 'MemberExpression',
      object: { type: 'FunctionExpression' },
      property: { type: 'Identifier', name: 'bind' },
    },
  });
  const filtered = bound.filter(path => {
    const v = path.value;
    const a = v.arguments;
    const is_named = !!v.callee.object.id;
    return !is_named && a && a.length === 1 && a[0].type === 'ThisExpression';
  });
  filtered.forEach(path => j(path).replaceWith(helpers.createArrowFunctionExpression(j, path.value.callee.object)));
  modified(filtered.size() > 0);
}
