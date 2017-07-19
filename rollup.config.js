import path from 'path';
import uglify from 'rollup-plugin-uglify';

export default [
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-validators.js'),
    format: 'cjs',
  },
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-validators.umd.js'),
    format: 'umd',
    moduleName: 'fluentValidators'
  },
  {
    entry: path.resolve(__dirname, 'lib', 'index.js'),
    dest: path.resolve(__dirname, 'fluent-validators.umd.min.js'),
    format: 'umd',
    moduleName: 'fluentValidators',
    // sourceMap: true
    plugins: [
      uglify({
        compress: true,
        mangle: true,
      }),
    ],
  },
];
