'use strict';

const assert = require('assert');

const core_node_modules = new Set([
  'assert', 'buffer', 'child_process', 'cluster', 'crypto',
  'dgram', 'dns', 'domain', 'events', 'fs', 'http', 'https',
  'net', 'os', 'path', 'punycode', 'querystring', 'readline',
  'repl', 'smalloc', 'stream', 'string_decoder', 'tls', 'tty',
  'url', 'util', 'v8', 'vm', 'zlib'
]);


module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const root = j(file.source);

  const programs = root.find(j.Program);
  assert(programs.size() === 1, 'There should only be one Program node');

  const body = programs.at(0).get('body');
  const statements = body.value;
  const import_nodes = [];
  const import_indices = [];
  statements.forEach((node, index) => {
    if (node.type === 'ImportDeclaration') {
      import_nodes.push(node);
      import_indices.push(index);
    }
  });

  if (import_nodes.length === 0) {
    return null;
  }

  sortNumbersInDescendingOrder(import_indices);
  import_indices.forEach(i => removeAt(statements, i));

  sortedImportDeclarations(import_nodes).forEach((node, i) => {
    insertAt(statements, node, i);
  });

  // TODO: return null if no reorder is needed

  return root.toSource({ quote: 'single' });
};


function sortedImportDeclarations(nodes) {
  const core = [];
  const npm = [];
  const local = [];

  nodes.forEach(node => {
    const name = node.source.value;
    const is_core = isCoreImport(name);
    const is_local = isLocalImport(name);
    const bucket = is_core ? core : is_local ? local : npm;
    bucket.push(node);
  });

  [core, npm, local].forEach(bucket => {
    bucket.sort((node_a, node_b) => {
      const a = node_a.source.value;
      const b = node_b.source.value;
      assert(a !== b, 'Duplicate import');
      return a < b ? -1 : 1;
    });
  });

  return core.concat(npm, local);
}

function sortNumbersInDescendingOrder(numbers) {
  numbers.sort((a, b) => b - a);
}

function isCoreImport(name) {
  return core_node_modules.has(name);
}

function isLocalImport(name) {
  const c = name[0];
  return c === '.' || c === '/';
}

function insertAt(array, value, index) {
  array.splice(index, 0, value);
}

function removeAt(array, index) {
  return array.splice(index, 1).length === 1;
}
