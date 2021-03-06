'use strict';

const helpers = require('./common/helpers');

const test_fn_names = new Set([
  'describe',
  'it',
]);

const setup_fn_names = new Set([
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

  const call_expressions = root.find(j.CallExpression, { callee: { type: 'Identifier' } });
  const call_to_setup_fns = call_expressions.filter(p => setup_fn_names.has(p.value.callee.name));

  const single_callback = call_to_setup_fns.filter(p => p.value[ARGS].length === 1 &&
                                                        p.value[ARGS][0].type === 'FunctionExpression' &&
                                                        canBeConvertedToArrow(j, p.value[ARGS][0]));

  const description_and_callback = call_to_setup_fns.filter(p => p.value[ARGS].length === 2 &&
                                                                 p.value[ARGS][0].type === 'Literal' &&
                                                                 p.value[ARGS][1].type === 'FunctionExpression' &&
                                                                 canBeConvertedToArrow(j, p.value[ARGS][1]));

  const call_to_test_fns = call_expressions.filter(p => test_fn_names.has(p.value.callee.name) &&
                                                        p.value[ARGS].length === 2 &&
                                                        p.value[ARGS][1].type === 'FunctionExpression' &&
                                                        canBeConvertedToArrow(j, p.value[ARGS][1]));

  if (single_callback.size() === 0 && description_and_callback.size() === 0 && call_to_test_fns.size() === 0) {
    return null;
  }

  single_callback.forEach(p => {
    const fn = p.value[ARGS][0];
    const arrow = helpers.createArrowFunctionExpression(j, fn);
    const is_named = fn.id && fn.id.type === 'Identifier';
    p.value[ARGS] = is_named ? [j.literal(fn.id.name), arrow] : [arrow];
  });

  description_and_callback.forEach(p => {
    p.value[ARGS][1] = helpers.createArrowFunctionExpression(j, p.value[ARGS][1]);
  });

  call_to_test_fns.forEach(p => {
    p.value[ARGS][1] = helpers.createArrowFunctionExpression(j, p.value[ARGS][1], true);
  });

  return root.toSource(printOptions);
};

function canBeConvertedToArrow(j, fn_expr) {
  return !helpers.containsThisExpression(j, fn_expr) && !helpers.containsArgumentsIdentifier(j, fn_expr);
}
