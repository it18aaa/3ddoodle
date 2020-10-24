const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
// const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

module.exports = {
    mode: 'development',
    devtool: 'source-maps',
    entry: "./src/index.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        // usedExports: true,
        // minimize: true,
        minimizer: [new UglifyJsPlugin()]
    },
    // plugins: [
    //     new BundleAnalyzerPlugin()
    //     ],
    devServer: {
        contentBase: path.join(__dirname, "dist"),
        port: 9000
    },
    module: {
        rules: [{
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env'],
                        plugins: ['@babel/plugin-proposal-class-properties']
                    }
                }
            },
            // {
            //     test: /\.css$/,
            //     use: [{
            //             loader: 'style-loader'
            //         },
            //         {
            //             loader: 'css-loader'
            //         }
            //     ]
            // },
            // {
            //     test: /\.(png|jpg)$/,
            //     use: [{
            //         loader: 'url-loader'
            //     }]
            // }
        ]
    }
}