const path = require("path");
const {typescriptRules} = require("./utils/typescript-rules");

function nodeTestConfig(env, argv) {
    return {
        target: 'node',
        devtool: false,
        resolve: {
            extensions: ['.ts'],
            alias: {
                'fetch-method': 'node-fetch'
            },
        },
        module: {
            rules: typescriptRules(env),
        },
        entry: {
            app: path.resolve('./test/test.ts')
        },
        output: {
            filename: 'test.js',
            path: path.resolve('./node-test-build')
        }
    }
}

module.exports = { nodeTestConfig };