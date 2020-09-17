import { nodeResolve } from '@rollup/plugin-node-resolve'
import commonjs from '@rollup/plugin-commonjs'

// import typescript from 'rollup-plugin-typescript2'
import typescript from '@rollup/plugin-typescript'

import pkg from './package.json'

export default [
  // browser-friendly UMD build
  {
    input: 'src/main.ts',
    output: {
      name: 'PKCE',
      dir: './',
      entryFileNames: pkg.browser,
      format: 'umd',
    },
    plugins: [
      nodeResolve(),
      commonjs(),
      typescript({ declaration: false, target: 'es5' }),
    ],
  },

  // CommonJS (for Node) and ES module (for bundlers) build.
  // (We could have three entries in the configuration array
  // instead of two, but it's quicker to generate multiple
  // builds from a single configuration where possible, using
  // an array for the `output` option, where we can specify
  // `file` and `format` for each target)
  {
    input: 'src/main.ts',
    external: [
      ...Object.keys(pkg.dependencies || {})
    ],
    plugins: [
      typescript(),
    ],
    output: [
      { dir: './', entryFileNames: pkg.main, format: 'cjs', exports: 'default' },
      { dir: './', entryFileNames: pkg.module, format: 'es' },
    ],
  },
]