'use strict';

const helpers = require('./common/helpers');

const TARGETS = new Set([
  'before',
  'after',
  'beforeEach',
  'afterEach',
]);

const ARGS = 'arguments';


module.exports = function(file, api, options) {
  const j = api.jscodeshift;
  const printOptions = options.printOptions || { quote: 'single' };
  const root = j(file.source);

  const call_to_setup_fns = root
      .find(j.CallExpression, { callee: { type: 'Identifier' } })
      .filter(p => TARGETS.has(p.value.callee.name));

  const single_callback = call_to_setup_fns
      .filter(p => p.value[ARGS].length === 1)
      .filter(p => p.value[ARGS][0].type === 'FunctionExpression')
      .filter(p => canBeConvertedToArrow(j, p.value[ARGS][0]));

  const description_and_callback = call_to_setup_fns
      .filter(p => p.value[ARGS].length === 2)
      .filter(p => p.value[ARGS][0].type === 'Literal' && p.value[ARGS][1].type === 'FunctionExpression')
      .filter(p => canBeConvertedToArrow(j, p.value[ARGS][1]));

  if (single_callback.size() === 0 && description_and_callback.size() === 0) {
    return null;
  }

  single_callback.forEach(p => {
    const fn = p.value[ARGS][0];
    const arrow = helpers.createArrowFunctionExpression(j, fn, true);
    const is_named = fn.id && fn.id.type === 'Identifier';
    p.value[ARGS] = is_named ? [j.literal(fn.id.name), arrow] : [arrow];
  });

  description_and_callback.forEach(p => {
    p.value[ARGS][1] = helpers.createArrowFunctionExpression(j, p.value[ARGS][1], true)
  });

  return root.toSource(printOptions);
};

function canBeConvertedToArrow(j, fn_body) {
  return !helpers.containsThisExpression(j, fn_body) && !helpers.containsArgumentsIdentifier(j, fn_body);
}
