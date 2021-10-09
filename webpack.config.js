const path = require('path');

function DtsBundlePlugin(options){
    this.apply = function (compiler) {
        compiler.hooks.done.tap('DtsBundlePlugin', function(){
            const dts = require('dts-bundle');
            dts.bundle(options);
        });
    };
}

module.exports = (env) => {
    let targetConfig;

    const tsLoaderOptions = {
        compilerOptions: {
        }
    };

    const commonConfig = {
        mode: 'none',
        devtool: false,
        resolve: {
            extensions: ['.ts'],
            alias: {
                'fetch-method': env.target === 'node' ? 'node-fetch' : path.resolve('./src/utils/window-fetch.ts')
            },
        },
        module: {
            rules: [
                {
                    test: /\.ts$/,
                    exclude: '/node_modules/',
                    use: {
                        loader: 'ts-loader',
                        options: tsLoaderOptions
                    },
                }
            ],
        },
    };

    switch (env.config) {
        case 'main':
            tsLoaderOptions.compilerOptions.declaration = true;

            targetConfig = {
                entry: {
                    app: path.resolve('./src/ts-rest.ts')
                },
                output: {
                    filename: 'ts-rest.js',
                    path: path.resolve('./build'),
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
                        out: path.resolve('./build/ts-rest.d.ts'),
                        removeSource: true,
                        outputAsModuleFolder: true
                    }),
                ]
            };
            break;
        case 'tests':
            targetConfig = {
                target: 'node',
                entry: {
                    app: path.resolve('./tests/test.ts')
                },
                output: {
                    filename: 'test.js',
                    path: path.resolve('./build-tests')
                }
            };
            break;
        default:
            throw new Error('Undefined config name in env.config');
    }

    return {
        ...commonConfig,
        ...targetConfig
    }
};