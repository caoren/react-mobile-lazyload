var path = require('path');
var webpack = require('webpack');
let isDeploy = process.env.NODE_ENV === 'production';
let config = {
    entry : {
        test : isDeploy ? path.resolve(__dirname,'test.jsx') : [
                'webpack/hot/dev-server',
                'webpack-dev-server/client?http://localhost:7909',
                path.resolve(__dirname,'test.jsx')
            ]
    },
    output : {
        path : path.resolve(__dirname, '../demo'),
        filename : '[name].js'
    },
    module : {
        loaders : [{
            test : /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-2']
            }
        }]
    },
    devtool: isDeploy ? false : 'eval-source-map',
    jshint : {
        "esnext" : true
    }
}
if(isDeploy){
    config.plugins = [
        new webpack.DefinePlugin({
            'process.env': {
                'NODE_ENV': JSON.stringify('production')
            }
        }),
        new webpack.optimize.UglifyJsPlugin({
           compress: {
               warnings: false
           }
        }),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.OccurenceOrderPlugin()
    ];
}

module.exports = config;