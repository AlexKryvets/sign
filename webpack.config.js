const path = require('path');
const webpack = require('webpack');

const ENV = process.env.npm_lifecycle_event;
const isDev = ENV === 'build:dev';
const isProd = ENV === 'build:prod';

const BrowserSyncPlugin = require('browser-sync-webpack-plugin');

var config = {
    entry: './src/index.ts',
    output: {
        filename: 'sign.js',
        path: path.resolve(__dirname, 'dist'),
        library: "sign"
    },
    resolve: {
        extensions: ['.ts', '.js', '.html']
    },
    module: {
        rules: [
            {
                test: /\.ts$/,
                loaders: ['ts-loader'],
                include: [/node_modules/, path.resolve(__dirname, 'src')]
            }
        ]
    },
    plugins: [
        new BrowserSyncPlugin({
            notify: false,
            open: false,
            host: 'localhost',
            port: 3000,
            tunnel: true,
            server: {
                baseDir: './'
            }
        })
    ]
};

if (isProd) {
    config.plugins.push(
        new webpack.NoEmitOnErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({mangle: {keep_fnames: true}})
    );
}

module.exports = config;