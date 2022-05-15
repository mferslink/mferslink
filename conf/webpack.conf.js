const path = require('path');
const webpack = require('webpack');
const resolve = dir => path.resolve(__dirname, '..', dir);

// const copyWebpackPlugin = require('copy-webpack-plugin');

const rules = [
    {
        test: /\.styl$/,
        use: [
            {
                loader: 'css-loader',
                options: {
                    importLoaders: 1
                }
            },
            'cache-loader',
            'stylus-loader'
        ]
    }
];

const getClientPlugins = ({isServer}) => {
    return [
        // new vConsolePlugin({
        //     filter: [], // 需要过滤的入口文件
        //     enable: true // 发布代码前记得改回 false
        // }),
        // new copyWebpackPlugin({
        //     patterns: [
        //         {
        //             from: resolve('src/dicts/rals.js'),
        //             to: resolve('dist/dicts/rals.js')
        //         }
        //     ]
        // }),
        new webpack.DefinePlugin({
            'process.env.RUNTIME_ENV': isServer ? JSON.stringify('server') : JSON.stringify('client')
        })
    ];
};

module.exports = (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    rules.forEach(rule => config.module.rules.push(rule));
    config.plugins = [...config.plugins, ...getClientPlugins({isServer})];
    if (!isServer) {
        // config.resolve.fallback.fs = false;
        // config.resolve.fallback.cluster = false;
    }
    return config;
};
