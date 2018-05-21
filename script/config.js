import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';

const version = '1.0.0'
const banner =
    '/**!\n' +
    ' * Iee.js version ' + version + '\n' +
    ' * (c) 2014-' + new Date().getFullYear() + ' Harrison DeStefano\n' +
    ' * Released under the MIT License.\n' +
    ' */'

const builds = {

    // Web ready
    'web-common-js': {
        dest: 'dist/iee.common.js',
        entry: 'src/platform/web/entry-web.js',
        format: 'umd',
        name: 'Iee',
        sourceMap: 'inline',
        banner,
        plugins: [
            eslint(),
            babel({
                exclude: 'node_modules/**'
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
        plugins: [ options.plugins]
    }

    return config
}

if (process.env.TARGET) {
    module.exports = getConfiguration(process.env.TARGET)
} else {
    throw new Error('The TARGET is missing, cannot get configuration');
}
