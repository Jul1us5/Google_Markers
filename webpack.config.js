const path = require("path");
const HtmlWebPackPlugin = require("html-webpack-plugin");
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
var OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack');

const isDev = process.env.NODE_ENV === 'development'

const filename = (dir,ext) => isDev ? `${dir}/[name].${ext}` : `${dir}/[name].[contenthash].${ext}` 

const cssLoaders = extra => {
    const loaders = [
        {
            loader: MiniCssExtractPlugin.loader,
            options: {
                publicPath: '../' // ADD -> for in .css links
            },
        },
        'css-loader'
    ]

    if(extra) {
        loaders.push(extra)
    }

    return loaders
}

module.exports = {
    entry: [
        __dirname + '/src/index.js',
    ],
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "js/[name].[contenthash].js",
    },
    module: {
        rules: [{
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.s[ac]ss$/,
                use: cssLoaders('sass-loader')
            },
            {
                test: /\.svg$/,
                use: ['@svgr/webpack'],
            },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]',
                },
            },
            {
                test: /\.(mp4|svg)$/,
                use: {
                    loader: "file-loader",
                    options: {
                        name: 'video/[name].[ext]'
                    }
                }
            },
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader,
                    "css-loader",
                ],
            },
        ],
    },
    devServer: {
        port: 9000,
        historyApiFallback: true,
        contentBase: './',
        hot: true

    },
    performance: {
        hints: process.env.NODE_ENV === 'production' ? "warning" : false
    },
    optimization: {
        minimizer: [
            new TerserPlugin({ extractComments: false }),
            new OptimizeCssAssetsPlugin()
        ],
    },
    plugins: [
        new MiniCssExtractPlugin({
            filename: filename('css', 'css'), // Where files deploy !!!!!!
        }),
        new HtmlWebPackPlugin({
            template: "./src/template/index.html",
            scriptLoading: 'defer',
            hash: true,
        }),
        new CleanWebpackPlugin({
            cleanStaleWebpackAssets: true, // Apparently files not referenced explicitly are treated as stale and removed
        }), //     Clean old files
        new Dotenv()

    ],
};