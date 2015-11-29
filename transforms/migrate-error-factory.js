'use strict';

const helpers = require('./common/helpers');

const MODULE_NAME = '@springworks/error-factory';


module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const modified = helpers.createChangeTracker();

  transformRequired(j, modified, root);
  transformImported(j, modified, root);

  return modified() ? root.toSource({ quote: 'single' }) : null;
};


function transformRequired(j, modified, root) {
  const require_calls = root.find(j.CallExpression, {
    callee: { name: 'require' },
    arguments: [{ value: MODULE_NAME }],
  });

  transformRequiredWithMember(j, modified, root, require_calls);
  transformRequiredWithObject(j, modified, root, require_calls);
}


function transformRequiredWithMember(j, modified, root, require_calls) {
  const filtered = require_calls.filter(path => {
    const ppv = path.parentPath.value;
    return ppv.type === 'MemberExpression' && ppv.property.name === 'create';
  });

  filtered.forEach(path => {
    path.parentPath.value.property.name = 'createError';
    const local_name = path.parentPath.parentPath.parentPath.value[0].id.name;
    transformCallExpressionsToCreateWithName(j, modified, root, local_name);
  });
}


function transformCallExpressionsToCreateWithName(j, modified, root, local_name) {
  const usage = root.find(j.CallExpression, { callee: { name: local_name } });
  usage.forEach(p => transformCallExpressionToCreate(j, p));
  modified(usage.size() > 0);
}


function transformRequiredWithObject(j, modified, root, require_calls) {
  const filtered = require_calls.filter(path => path.parentPath.value.type === 'VariableDeclarator');

  filtered.forEach(path => {
    const local_name = path.parentPath.value.id.name;
    const usage = root.find(j.MemberExpression, { object: { name: local_name }, property: { name: 'create' } });
    usage.forEach(p => {
      p.value.property.name = 'createError';
      transformCallExpressionToCreate(j, p.parentPath);
    });
    modified(usage.size() > 0);
  });
}


function transformImported(j, modified, root) {
  const import_declarations = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        type: 'ImportSpecifier',
        imported: { type: 'Identifier', name: 'create' },
      },
    ],
    source: { value: '@springworks/error-factory' },
  });

  import_declarations.forEach(path => {
    const specifier = path.value.specifiers.filter(o => o.imported.name === 'create')[0];
    const local_name = specifier.local.name;

    specifier.imported.name = 'createError';

    if (local_name === 'createError') {
      delete specifier.local;
    }

    transformCallExpressionsToCreateWithName(j, modified, root, local_name);
  });
}


function transformCallExpressionToCreate(j, path) {
  const args = path.value.arguments;
  const props = [];

  if (args.length > 0) {
    props.push(j.property('init', j.identifier('code'), args[0]));
  }
  if (args.length > 1) {
    props.push(j.property('init', j.identifier('message'), args[1]));
  }

  const err_id = findErrorIdentifier(path);
  if (err_id) {
    props.push(j.property('init', j.identifier('cause'), err_id));
  }

  const params = j.objectExpression(props);
  path.value.arguments = [params];
}


function findErrorIdentifier(path) {
  while (path && (path = path.parentPath)) {
    if (path.value.type === 'FunctionExpression' || path.value.type === 'FunctionDeclaration' || path.value.type === 'ArrowFunctionExpression') {
      if (path.value.params.length > 0 && nameMightBeAnError(path.value.params[0].name)) {
        return path.value.params[0];
      }
    }
    if (path.value.type === 'CatchClause' && nameMightBeAnError(path.value.param.name)) {
      return path.value.param;
    }
  }
  return null;
}


function nameMightBeAnError(name) {
  const regex = /^(.+_)?err(or)?$/;
  return regex.test(name);
}
