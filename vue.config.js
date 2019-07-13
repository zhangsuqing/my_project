var path = require('path');

module.exports = {
  lintOnSave: false,
  publicPath: (process.env.NODE_ENV === 'production') ? './' : '/',
  configureWebpack: {
    resolve: {
      extensions: ['.js', '.vue'],
      alias: {
        '@': path.resolve(__dirname, './src'),
        'fonts': path.resolve(__dirname, './src/assets/fonts'),
        'images': path.resolve(__dirname, './src/assets/images'),
        'style': path.resolve(__dirname, './src/assets/style')
      }
    },
    module: {
      rules: [{
        test: /\.scss$/,
        use: [{
          loader: 'sass-loader'
        }]
      },
      {
        test: /\.svg$/,
        loader: 'svg-sprite-loader',
        include: [path.resolve('src/icons')],
        options: {
          symbolId: 'icon-[name]'
        }
      }]
    }
  }
};