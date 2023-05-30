import swc from '@rollup/plugin-swc';
import resolve from '@rollup/plugin-node-resolve';

//import pkg from './package.json' assert { type: "json" };
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const pkg = require('./package.json');

const version = pkg.version;
const year = new Date().getFullYear()
const banner = `/*
  LitWidget ${version}
  Copyright (C) ${year} Andy Chentsov <chentsov@gmail.com>
  @license BSD-3-Clause
*/
`

export default [
  {
    external: ['lit', 'lit/directives/template-content.js'],

    input: './src/index.js',
    output: {
      file: './dist/index.js',

      format: 'iife',
      extend: true,
      name: 'window',
      strict: false,

      sourcemap: true,
      globals: {
        'lit': 'lit',
        'lit/directives/template-content.js': 'templateContent',
      },

      banner: banner,
      indent: '  '
    },
    plugins: [
      resolve(),
      swc({
        rollup: {
          exclude: './node_modules/',
        },
        swc: {
          jsc: {
            //target: 'es2015',
            target: 'es5',
            parser: {
              syntax: 'typescript',
              decorators: true
            },
            transform: {
              decoratorMetadata: true,
              legacyDecorator: true
            },
            loose: true,
            minify: {
              compress: {},
              format: {
                //comments: 'some',
                comments: 'all',
              },
            },
          }
        }
      }),
    ],
  },

  {
    external: ['lit', 'lit/directives/template-content.js'],
    context: 'this',
    moduleContext: 'this',

    input: './src/index.js',
    output: {
      file: './dist/module.js',

      format: 'esm',

      extend: true,
      sourcemap: true,

      banner: banner,
      indent: '  '
    },
    plugins: [
      resolve(),
      swc({
        rollup: {
          exclude: './node_modules/',
        },
        swc: {
          jsc: {
            target: 'es2015',
            parser: {
              syntax: 'typescript',
              decorators: true
            },
            transform: {
              decoratorMetadata: true,
              legacyDecorator: true
            },
            loose: true,
            minify: {
              compress: {},
              format: {
                //comments: 'some',
                comments: 'all',
              },
            },
          }
        }
      }),
    ],
  },
]
