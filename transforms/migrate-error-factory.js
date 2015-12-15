'use strict';

const helpers = require('./common/helpers');

const MODULE_NAME = '@springworks/error-factory';


module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const modified = helpers.createChangeTracker();
  const file_path = file.path;

  transformRequired(j, file_path, modified, root);
  transformImported(j, file_path, modified, root);

  return modified() ? root.toSource({ quote: 'single' }) : null;
};


function transformRequired(j, file_path, modified, root) {
  const require_calls = root.find(j.CallExpression, {
    callee: { name: 'require' },
    arguments: [{ value: MODULE_NAME }],
  });

  transformRequiredWithMember(j, file_path, modified, root, require_calls);
  transformRequiredWithObject(j, file_path, modified, root, require_calls);
}


function transformRequiredWithMember(j, file_path, modified, root, require_calls) {
  const filtered = require_calls.filter(path => {
    const ppv = path.parentPath.value;
    return ppv.type === 'MemberExpression' && ppv.property.name === 'create';
  });

  filtered.forEach(path => {
    path.parentPath.value.property.name = 'createError';
    const local_name = path.parentPath.parentPath.parentPath.value[0].id.name;
    transformCallExpressionsToCreateWithName(j, file_path, modified, root, local_name);
  });
}


function transformCallExpressionsToCreateWithName(j, file_path, modified, root, local_name) {
  const usage = root.find(j.CallExpression, { callee: { name: local_name } });
  usage.forEach(p => transformCallExpressionToCreate(j, file_path, modified, p));
}


function transformRequiredWithObject(j, file_path, modified, root, require_calls) {
  const filtered = require_calls.filter(path => path.parentPath.value.type === 'VariableDeclarator');

  filtered.forEach(path => {
    const local_name = path.parentPath.value.id.name;
    const usage = root.find(j.MemberExpression, { object: { name: local_name }, property: { name: 'create' } });
    usage.forEach(p => {
      transformCallExpressionToCreate(j, file_path, modified, p.parentPath);
      p.value.property.name = 'createError';
    });
  });
}


function transformImported(j, file_path, modified, root) {
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

    transformCallExpressionsToCreateWithName(j, file_path, modified, root, local_name);
  });
}


function transformCallExpressionToCreate(j, file_path, modified, path) {
  const args = path.value.arguments;

  assertWithCodeLocation(args.length <= 2, 'create() called with too many arguments. Use a string template instead of a format string.', j, file_path, path);

  const props = [];
  if (args.length > 0) {
    assertIdentifierOrLiteralWithCodeLocation(args[0], 'number', 'Expected first arg to be a number.', j, file_path, path);
    props.push(j.property('init', j.identifier('code'), args[0]));
  }
  if (args.length > 1) {
    assertIdentifierOrLiteralWithCodeLocation(args[1], 'string', 'Expected second arg to be a string.', j, file_path, path);
    props.push(j.property('init', j.identifier('message'), args[1]));
  }

  const err_id = findErrorIdentifier(path);
  if (err_id) {
    props.push(j.property('init', j.identifier('cause'), err_id));
  }

  const params = j.objectExpression(props);
  path.value.arguments = [params];

  modified(true);
}


function assertIdentifierOrLiteralWithCodeLocation(node, expected_literal_type, message, j, file_path, path) {
  assertWithCodeLocation(node.type === 'Identifier' || (node.type === 'Literal' && typeof node.value === expected_literal_type), message, j, file_path, path);
}


function assertWithCodeLocation(value, message, j, file_path, path) {
  /* istanbul ignore if */
  if (!value) {
    const error = new Error(message + '\n\n' + j(path.parent).toSource().split('\n').map(s => '>   ' + s).join('\n'));
    error.stack = file_path + ':' + path.value.loc.start.line + '\n\n';
    throw error;
  }
}


function findErrorIdentifier(path) {
  while (path && (path = path.parentPath)) {
    if (path.value.type === 'FunctionExpression' || path.value.type === 'FunctionDeclaration' || path.value.type === 'ArrowFunctionExpression') {
      if (path.value.params.length > 0 && nameMightBeAnError(path.value.params[0].name)) {
        return path.value.params[0];
      }
    }
    if (path.value.type === 'CatchClause') {
      return path.value.param;
    }
  }
  return null;
}


function nameMightBeAnError(name) {
  const regex = /^(.+_)?err(or)?$/;
  return regex.test(name);
}
