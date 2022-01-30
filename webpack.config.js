const {browserVersionConfig} = require("./webpack/browser-version-config");
const {nodeVersionConfig} = require("./webpack/node-version-config");
const {browserTestConfig} = require("./webpack/browser-test-config");
const {nodeTestConfig} = require("./webpack/node-test-config");

const nameToConfig = {
    browser: browserVersionConfig,
    node: nodeVersionConfig,
    "test": nodeTestConfig,
    "browser-test": browserTestConfig,
}

module.exports = (env, argv) => {
    const config = nameToConfig[env.config];

    if (!config) {
        throw new Error("Incorrect config name");
    }

    return config(env, argv);
};