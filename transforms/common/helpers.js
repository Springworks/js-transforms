'use strict';


exports.createChangeTracker = createChangeTracker;
function createChangeTracker() {
  let modified = false;
  return value => modified = modified || !!value;
}


exports.createArrowFunctionExpression = createArrowFunctionExpression;
function createArrowFunctionExpression(j, fn, force_block_statement) {
  let body = fn.body;
  let is_expression = body.type === 'Expression';
  if (body.type === 'BlockStatement' && body.body.length === 1) {
    const statement = fn.body.body[0];
    if (!force_block_statement && statement.type === 'ReturnStatement') {
      body = statement.argument;
      is_expression = true;
    }
  }
  return j.arrowFunctionExpression(fn.params, body, is_expression);
}


exports.containsThisExpression = containsThisExpression;
function containsThisExpression(j, path) {
  const this_expressions = j(path).find(j.ThisExpression);
  const immediate_descendants = inOwnFunctionScope(this_expressions, path);
  return immediate_descendants.size() > 0;
}


exports.containsArgumentsIdentifier = containsArgumentsIdentifier;
function containsArgumentsIdentifier(j, path) {
  const arguments_identifiers = j(path).find(j.Identifier, { name: 'arguments' });
  const immediate_descendants = inOwnFunctionScope(arguments_identifiers, path);
  return immediate_descendants.size() > 0;
}


function inOwnFunctionScope(collection, scope) {
  return collection.filter(path => {
    for (let p = path.parent; p && p !== scope && p.value !== scope; p = p.parent) {
      if (p.value.type === 'FunctionExpression' || p.value.type === 'FunctionDeclaration') {
        return false;
      }
    }
    return true;
  });
}
