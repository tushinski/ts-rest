
function typescriptRules(env, declaration = false) {
    return [
        {
            test: /\.ts$/,
            exclude: '/node_modules/',
            use: {
                loader: 'ts-loader',
                options: {
                    compilerOptions: {
                        declaration: declaration
                    }
                }
            },
        }
    ]
}

module.exports = { typescriptRules }