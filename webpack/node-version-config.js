const path = require("path");
const {DtsBundlePlugin} = require("./plugins/DtsBundlePlugin");
const {typescriptRules} = require("./utils/typescript-rules");
const {PostBuildPlugin} = require("./plugins/PostBuildPlugin");
const CopyPlugin = require("copy-webpack-plugin");

function nodeVersionConfig(env, argv) {
    return {
        target: 'node',
        devtool: false,
        entry: {
            app: path.resolve('./src/ts-rest.ts')
        },
        resolve: {
            extensions: ['.ts'],
            alias: {
                'fetch-method': 'node-fetch'
            },
        },
        module: {
            rules: typescriptRules(env, true),
        },
        output: {
            filename: 'ts-rest-node.js',
            path: path.resolve('./node-build'),
            library: {
                name: 'ts-rest-node',
                type: 'umd',
                umdNamedDefine: true
            }
        },
        plugins: [
            new DtsBundlePlugin({
                name: 'ts-rest',
                main: path.resolve('./src/ts-rest.d.ts'),
                out: path.resolve('./node-build/ts-rest-node.d.ts'),
                removeSource: true,
                outputAsModuleFolder: true
            }),
            new CopyPlugin({
                patterns: [
                    { from: "./README.md", to: "./README.md" }
                ]
            }),
            new PostBuildPlugin({
                target: "node"
            })
        ],
    }
}

module.exports = { nodeVersionConfig };