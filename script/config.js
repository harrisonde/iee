import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import cleanup from 'rollup-plugin-cleanup';
import { uglify } from 'rollup-plugin-uglify';
import replace from 'rollup-plugin-replace';

const version = '1.0.0'
const banner =
    '/**!\n' +
    ' * Iee.js version ' + version + '\n' +
    ' * (c) 2014-' + new Date().getFullYear() + ' Harrison DeStefano\n' +
    ' * @license Released under the MIT License.\n' +
    ' */'

const builds = {
    'web-js': {
        dest: 'dist/iee.js',
        entry: 'src/platform/web/entry-web.js',
        format: 'umd',
        name: 'Iee',
        sourceMap: 'inline',
        banner,
        plugins: [
            eslint(),
            cleanup(),
            babel({
                exclude: 'node_modules/**'
            })
        ]
    },
    'web-min-js': {
        dest: 'dist/iee.min.js',
        entry: 'src/platform/web/entry-web.js',
        format: 'umd',
        name: 'Iee',
        sourceMap: 'inline',
        banner,
        plugins: [
            replace({
                BUILD_TARGET: process.env.BUILD_TARGET
            }),
            eslint(),
            babel({
                exclude: 'node_modules/**'
            }),
            uglify({
                output: {
                    comments: function(node, comment) {
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
    }
}

function getConfiguration(buildTarget) {
    let options = builds[buildTarget]
    let config = {
        external: [],
        input:  options.entry,
        output: {
            file: options.dest,
            format: options.format,
            banner: options.banner,
            name: options.name || 'iee'
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
