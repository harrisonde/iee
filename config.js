import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import cleanup from 'rollup-plugin-cleanup';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';
import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve';
import rollupJson from 'rollup-plugin-json';
import typescript from 'rollup-plugin-typescript';
const packageConfig = require('./package.json');

const banner =
    '/**!\n' +
    ' * ' + packageConfig.name + ' version ' + packageConfig.version + '\n' +
    ' * Copyright ' + new Date().getFullYear() + ' ' + packageConfig.author + '\n' +
    ' * @license Released under the ' + packageConfig.license + ' license.\n' +
    ' */'

const name =  'window-rivet'

const plugins = [
    typescript({
        target: "es5"
    }),
    replace({
        BUILD_TARGET: process.env.BUILD_TARGET,
        'process.env.NODE_ENV': '"production"',
        '__VERSION__': packageConfig.version,
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

const builds = {
    'web-js': {
        dest: `dist/${name}-umd.js`,
        format: 'umd',
    },
    'web-min-js': {
        dest: `dist/${name}-umd-min.js`,
        format: 'umd',
        plugins: 
            plugins.concat(
                [
                    uglify({
                        compress: {
                            drop_console: true
                        },
                        output: {
                            comments: function (node, comment) {
                                var text = comment.value;
                                var type = comment.type;
                                if (type == "comment2") {
                                    // multiline comment
                                    return /@preserve|@license|@cc_on/i.test(text);
                                }
                            }
                        }
                    })                    
                ]
            ),
        
    },
    'module-js': {
        dest: `dist/${name}-es.js`,
        format: 'es'
    }
}

function getConfiguration(buildTarget) {  
    let options = Object.assign({
        banner,
        entry: 'src/platform/web/entry-web.js',
        name: name,
        plugins: plugins,
        sourceMap: 'inline',
    } , builds[buildTarget])
    let config = {
        external: [],
        input: options.entry,
        output: {
            file: options.dest,
            format: options.format,
            banner: options.banner,
            name: 'rivet'
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