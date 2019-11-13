import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import cleanup from 'rollup-plugin-cleanup';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json'
import typescript from 'rollup-plugin-typescript';
const config = require('./package.json')

const banner =
    '/**!\n' +
    ' * ' + config.name + ' version ' + config.version + '\n' +
    ' * (c) 2014-' + new Date().getFullYear() + ' ' + config.author + '\n' +
    ' * @license Released under the ' + config.license + ' license.\n' +
    ' */'

const name = 'IframeEventEmitter'

const builds = {
    'web-js': {
        dest: `dist/${name}.js`,
        entry: 'src/platform/web/entry-web.js',
        format: 'es',
        name: name,
        sourceMap: 'inline',
        banner,
        plugins: [
            typescript({
                target: "es5"
            }),
            replace({
                BUILD_TARGET: process.env.BUILD_TARGET,
                'process.env.NODE_ENV': '"production"',
                '__VERSION__': config.version,
                '__BUILD_FORMAT__': 'umd',
            }),
            resolve({ jsnext: true, preferBuiltins: true, browser: true }),
            commonjs(),
            rollupJson({ include: 'node_modules/**' }),
            babel({
                exclude: 'node_modules/**'
            }),
            eslint({
                configFile: 'eslint.config'
            }),
            cleanup()
        ]
    }
}

function getConfiguration(buildTarget) {
    let options = builds[buildTarget]
    let config = {
        external: [],
        input: options.entry,
        output: {
            file: options.dest,
            format: options.format,
            banner: options.banner,
            name: options.name || 'Deploy'
        },
        plugins: options.plugins
    }

    return config
}

if (process.env.BUILD_TARGET) {
    module.exports = getConfiguration(process.env.BUILD_TARGET)
} else {
    throw new Error('The BUILD_TARGET is missing, cannot get configuration');
}