const path = require("path");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");


module.exports = {
    mode: 'development',
    entry: "./src/drawoutline.js",
    output: {
        filename: "main.js",
        path: path.resolve(__dirname, "dist")
    },
    optimization: {
        minimizer: [new UglifyJsPlugin()]
    },
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
            {
                test: /\.css$/,
                use: [{
                        loader: 'style-loader'
                    },
                    {
                        loader: 'css-loader'
                    }
                ]
            },
            {
                test: /\.(png|jpg)$/,
                use: [{
                    loader: 'url-loader'
                }]
            }
        ]
    }
}