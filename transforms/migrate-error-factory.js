'use strict';

const MODULE_NAME = '@springworks/error-factory';


module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);
  //const results = [];
  //const tracker = v => results.push(!!v);

  const result = [
    transformRequired(j, root),
    transformImported(j, root),
  ];

  if (!result.some(Boolean)) {
    return null;
  }

  const print_options = options.printOptions || { quote: 'single' };
  return root.toSource(print_options);
};


function transformRequired(j, root) {
  const require_calls = root.find(j.CallExpression, {
    callee: { name: 'require' },
    arguments: [{ value: MODULE_NAME }],
  });

  if (require_calls.size() === 0) {
    return false;
  }

  const result = [
    transformRequiredWithMember(j, root, require_calls),
    transformRequiredWithObject(j, root, require_calls),
  ];
  return result.some(Boolean);
}


function transformRequiredWithMember(j, root, require_calls) {
  const filtered = require_calls.filter(path => {
    const ppv = path.parentPath.value;
    return ppv.type === 'MemberExpression' && ppv.property.name === 'create';
  });

  if (filtered.size() === 0) {
    return false;
  }

  let modified = [];
  filtered.forEach(path => {
    path.parentPath.value.property.name = 'createError';
    const local_name = path.parentPath.parentPath.parentPath.value[0].id.name;
    const result = transformCallExpressionsToCreateWithName(j, root, local_name);
    modified.push(result);
  });

  return modified.some(Boolean);
}


function transformCallExpressionsToCreateWithName(j, root, local_name) {
  const usage = root.find(j.CallExpression, { callee: { name: local_name } });
  usage.forEach(p => transformCallExpressionToCreate(j, p));
  return usage.size() > 0;
}


function transformRequiredWithObject(j, root, require_calls) {
  const filtered = require_calls.filter(path => path.parentPath.value.type === 'VariableDeclarator');

  if (filtered.size() === 0) {
    return false;
  }

  let modified = false;

  filtered.forEach(path => {
    const local_name = path.parentPath.value.id.name;
    const usage = root.find(j.MemberExpression, { object: { name: local_name }, property: { name: 'create' } });

    modified = usage.size();

    usage.forEach(p => transformCallExpressionToCreate(j, p.parentPath));
  });

  return modified;
}


function transformImported(j, root) {
  const import_declarations = root.find(j.ImportDeclaration, {
    specifiers: [
      {
        type: 'ImportSpecifier',
        imported: { type: 'Identifier', name: 'create' },
      },
    ],
    source: { value: '@springworks/error-factory' },
  });


  if (import_declarations.size() === 0) {
    return false;
  }

  let modified = [];

  import_declarations.forEach(path => {
    const specifier = path.value.specifiers.filter(o => o.imported.name === 'create')[0];
    const local_name = specifier.local.name;

    specifier.imported.name = 'createError';

    if (local_name === 'createError') {
      delete specifier.local;
    }

    const result = transformCallExpressionsToCreateWithName(j, root, local_name);
    modified.push(result);
  });

  return modified.some(Boolean);
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
    if (path.value.type === 'FunctionExpression' || path.value.type === 'FunctionDeclaration') {
      if (path.value.params.length > 0 && nameMightBeAnError(path.value.params[0].name)) {
        return path.value.params[0];
      }
    }
  }
  return null;
}


function nameMightBeAnError(name) {
  const regex = /^(.+_)?err(or)?$/;
  return regex.test(name);
}
