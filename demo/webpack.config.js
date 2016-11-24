var path = require('path');
module.exports = {
    entry : {
        test : [
            'webpack/hot/dev-server',
            'webpack-dev-server/client?http://localhost:7909',
            path.resolve(__dirname,'test.jsx')
        ]
    },
    output : {
        path : path.resolve(__dirname, '/'),
        filename : '[name].js'
    },
    module : {
        perLoaders : [{
            test: /\.jsx?$/,
            include: __dirname,
            loader: 'jshint-loader'
        }],
        loaders : [{
            test : /\.jsx?$/,
            exclude: /(node_modules|bower_components)/,
            loader: 'babel',
            query: {
                presets: ['react', 'es2015', 'stage-2']
            }
        }]
    },
    devtool: 'eval-source-map',
    jshint : {
        "esnext" : true
    }
};