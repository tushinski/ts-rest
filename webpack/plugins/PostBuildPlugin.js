const fs = require("fs");
const path = require("path");

/**
 * @param {{ target: "browser" | "node" }} options
 * @constructor
 */
function PostBuildPlugin(options){
    this.apply = function (compiler) {
        compiler.hooks.done.tap('PostBuildPlugin', function() {
            const originalPackageJson = fs.readFileSync("./package.json");
            const originalPackageData = JSON.parse(originalPackageJson);
            const pickedFields = [
                "name",
                "version",
                "description",
                "files",
                "repository",
                "keywords",
                "author",
                "license",
                "dependencies"
            ];

            let targetData = {};

            switch (options.target) {
                case "browser":
                    targetData = {
                        name: "@tushinski/ts-rest",
                        main: "./ts-rest.js",
                        types: "./ts-rest.d.ts",
                        keywords: [
                            "rest",
                            "client",
                            "http",
                            "ts-rest"
                        ]
                    };
                    break;
                case "node":
                    targetData = {
                        name: "@tushinski/ts-rest-node",
                        main: "./ts-rest-node.js",
                        types: "./ts-rest-node.d.ts",
                        keywords: [
                            "rest",
                            "client",
                            "http",
                            "ts-rest-node"
                        ]
                    };
                    break;
                default:
                    throw new Error("Incorrect target option.");
            }

            const pickedData = {};
            pickedFields.forEach(field => {
                pickedData[field] = originalPackageData[field];
            });

            const targetJSON = JSON.stringify({
                ...pickedData,
                ...targetData
            }, null, 4);

            const filePath = path.resolve(
                options.target === "node" ?
                    "./node-build/package.json"
                    : "./browser-build/package.json"
            );

            fs.writeFileSync(filePath, targetJSON);
        });
    };
}

module.exports = { PostBuildPlugin };