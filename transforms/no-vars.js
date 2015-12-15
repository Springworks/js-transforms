'use strict';

const helpers = require('./common/helpers');


module.exports = function(file, api) {
  const j = api.jscodeshift;
  const root = j(file.source);
  const modified = helpers.createChangeTracker();
  const file_path = file.path;

  convertVariableDeclarations(j, modified, root, file_path);
  convertForLoopInitAssignments(j, modified, root);

  return modified() ? root.toSource({ quote: 'single' }) : null;
};


function convertVariableDeclarations(j, modified, root, file_path) {
  return root.find(j.VariableDeclaration).forEach(path => {
    const kind = path.value.kind;
    if (kind === 'const') {
      return;
    }

    if (isForLoopType(path.parent.value.type)) {
      convertLoopVariableDeclarations(j, modified, path, file_path);
      return;
    }

    const lets = [];
    const consts = [];
    path.value.declarations.forEach(decl => {
      if (decl.init && !isMutated(j, path, decl)) {
        consts.push(decl);
      }
      else if (kind !== 'let') {
        lets.push(decl);
      }
    });

    const replacements = [];
    if (lets.length) {
      replacements.push(j.variableDeclaration('let', lets));
    }
    if (consts.length) {
      replacements.push(j.variableDeclaration('const', consts));
    }

    if (replacements.length) {
      if (path.value.comments || path.value.leadingComments) {
        replacements[0].leadingComments = path.value.leadingComments;
        replacements[0].comments = path.value.comments;
      }
      j(path).replaceWith(replacements);
      modified(true);
    }
  });
}


function convertLoopVariableDeclarations(j, modified, path, file_path) {
  if (!isAccessedInClosure(j, path.parent)) {
    path.value.kind = path.value.declarations.some(declaration => isMutated(j, path, declaration)) ? 'let' : 'const';
    modified(true);
    return;
  }

  /* istanbul ignore if */
  if (process.env.NODE_ENV !== 'test') {
    console.warn(
        'WARNING: A variable binding in a `for` loop is accessed ' +
        'inside a new scope. This could be indicative of a race ' +
        'condition or other unintended access. We have left the ' +
        'binding as a `var`. View the following code at `%s:%s`',
        file_path, path.value.loc.start.line
    );
    console.log(j(path.parent).toSource() + '\n');
  }
}


function convertForLoopInitAssignments(j, modified, root) {
  root.find(j.ForStatement, { init: { type: 'AssignmentExpression' } }).forEach(p => {
    p.value.init = j.variableDeclaration('let', [j.variableDeclarator(p.value.init.left, p.value.init.right)]);
    modified(true);
  });
}


function isMutated(j, path, declarator) {
  const scope = j(path.parent);
  return hasAssignmentMutation(j, declarator, scope) || hasUpdateMutation(j, declarator, scope);
}


function hasAssignmentMutation(j, declarator, scope) {
  return scope.find(j.AssignmentExpression).paths().some(p => {
    if (declarator.id.type === 'ObjectPattern') {
      return isIdentifierInObjectPattern(declarator.id, p.value.left);
    }
    if (declarator.id.type === 'ArrayPattern') {
      return isIdentifierInArrayPattern(declarator.id, p.value.left);
    }
    if (p.value.left.type === 'ObjectPattern') {
      return isIdentifierInObjectPattern(p.value.left, declarator.id);
    }
    if (p.value.left.type === 'ArrayPattern') {
      return isIdentifierInArrayPattern(p.value.left, declarator.id);
    }
    return declarator.id.name === p.value.left.name;
  });
}


function hasUpdateMutation(j, declarator, scope) {
  return scope.find(j.UpdateExpression).paths().some(p => {
    if (declarator.id.type === 'ObjectPattern') {
      return isIdentifierInObjectPattern(declarator.id, p.value.argument);
    }
    if (declarator.id.type === 'ArrayPattern') {
      return isIdentifierInArrayPattern(declarator.id, p.value.argument);
    }
    return declarator.id.name === p.value.argument.name;
  });
}


function isIdentifierInObjectPattern(node, id) {
  return node.properties.some(n => (n.type === 'SpreadProperty' ? n.argument.name : n.value.name) === id.name);
}


function isIdentifierInArrayPattern(node, id) {
  return node.elements.some(n => (n.type === 'RestElement' ? n.argument.name : n.name) === id.name);
}


function isAccessedInClosure(j, node) {
  return j(node.value.body).find(j.Identifier).paths().some(n => {
    const field = node.value.init || node.value.left;
    const declarations = field && field.declarations;
    if (declarations.some(d => d.id.name === n.value.name)) {
      let parent = n.parent;
      while (parent.value !== node.value.body) {
        parent = parent.parent;
        if (isFunctionType(parent.value.type)) {
          return true;
        }
      }
      return false;
    }
    return false;
  });
}


function isForLoopType(type) {
  return type === 'ForStatement' || type === 'ForInStatement' || type === 'ForOfStatement';
}


function isFunctionType(type) {
  return type === 'Function' || type === 'FunctionDeclaration' || type === 'FunctionExpression' || type === 'ArrowFunctionExpression';
}
