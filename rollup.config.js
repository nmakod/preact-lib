import babel from '@rollup/plugin-babel';
import external from 'rollup-plugin-peer-deps-external';
import del from 'rollup-plugin-delete';
import typescript from '@rollup/plugin-typescript';
import json from '@rollup/plugin-json';
import commonjs from '@rollup/plugin-commonjs';
import pkg from './package.json';

export default {
  input: pkg.source,
  output: [
    { file: pkg.main, format: 'cjs', inlineDynamicImports: true },
    { file: pkg.module, format: 'esm', inlineDynamicImports: true },
  ],
  plugins: [
    external(),
    json(),
    commonjs(),
    typescript(),
    babel({
      exclude: 'node_modules/**',
    }),
    del({ targets: ['dist/*'] }),
  ],
  external: Object.keys(pkg.peerDependencies || {}),
};
