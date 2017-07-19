import path from 'path';

export default {
  entry: path.resolve(__dirname, 'lib', 'index.js'),
  dest: path.resolve(__dirname, 'fluent-validators.js'),
  format: 'cjs',
  moduleName: 'fluentValidators',
  // sourceMap: true
};