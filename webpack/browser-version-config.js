const path = require("path");
const {DtsBundlePlugin} = require("./utils/DtsBundlePlugin");
const {typescriptRules} = require("./utils/typescript-rules");

function browserVersionConfig(env, argv) {
    return {
        devtool: false,
        entry: {
            app: path.resolve('./src/ts-rest.ts')
        },
        resolve: {
            extensions: ['.ts'],
            alias: {
                'fetch-method': path.resolve('./src/utils/window-fetch.ts')
            },
        },
        module: {
            rules: typescriptRules(env, true),
        },
        output: {
            filename: 'ts-rest.js',
            path: path.resolve('./browser-build'),
            library: {
                name: 'ts-rest',
                type: 'umd',
                umdNamedDefine: true
            }
        },
        plugins: [
            new DtsBundlePlugin({
                name: 'ts-rest',
                main: path.resolve('./src/ts-rest.d.ts'),
                out: path.resolve('./browser-build/ts-rest.d.ts'),
                removeSource: true,
                outputAsModuleFolder: true
            }),
        ]
    }
}

module.exports = { browserVersionConfig };