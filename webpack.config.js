const path = require('path');

module.exports = {
    entry: {
        client: './src/client/index.ts'
    },
    target: 'node',
    externals: [
        /node_modules/,
    ],
    devtool: 'inline-source-map',
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
            }
        ]
    },
    resolve: {
        extensions: ['.ts', '.js']
    },
    output: {
        filename: '[name].js',
        path: path.resolve(__dirname, 'dist')
    }
};