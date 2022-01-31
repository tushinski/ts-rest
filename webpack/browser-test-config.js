const path = require("path");
const {typescriptRules} = require("./utils/typescript-rules");

function browserTestConfig(env, argv) {
    return {
        devtool: false,
        resolve: {
            extensions: ['.ts'],
            alias: {
                'fetch-method': path.resolve('./src/utils/window-fetch.ts')
            },
        },
        module: {
            rules: typescriptRules(env),
        },
        entry: {
            app: path.resolve('./browser-test/test.ts')
        },
        output: {
            filename: 'test.js',
            path: path.resolve('./browser-test/'),
        }
    }
}

module.exports = { browserTestConfig };