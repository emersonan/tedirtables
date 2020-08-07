import resolve from '@rollup/plugin-node-resolve';
import babel from '@rollup/plugin-babel';
import json from '@rollup/plugin-json';
import {terser} from 'rollup-plugin-terser';

export default [
    {
        input: 'src/tedirtables.js',
        output: [
            {
                file: 'dist/tedirtables.js',
                format: 'umd',
                name: 'tedirtables'
            },
            {
                file: 'dist/tedirtables.min.js',
                format: 'umd',
                name: 'tedirtables',
                plugins: [terser()]
            }
        ],
        plugins: [
            resolve(),
            babel({ babelHelpers: 'bundled' }),
            json()
        ]
    },
    {
        input: 'src/tedirtables-bootstrap5.js',
        output: [
            {
                file: 'dist/tedirtables-bootstrap5.js',
                format: 'umd',
                name: 'tedirtables'
            },
            {
                file: 'dist/tedirtables-bootstrap5.min.js',
                format: 'umd',
                name: 'tedirtables',
                plugins: [terser()]
            }
        ],
        plugins: [
            resolve(),
            babel({ babelHelpers: 'bundled' }),
            json()
        ]
    }
];
