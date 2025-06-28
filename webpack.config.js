// webpack.config.js
const Encore = require('@symfony/webpack-encore');

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'production');
}

Encore
  // ← single output directory
  .setOutputPath('public/build/')
  .setPublicPath('/build')

  // your entry
  .addEntry('app', './Resources/app/app.js')

  // optimisation & versioning
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())

  // loaders
  .configureBabel((config) => {
    config.plugins.push('@babel/plugin-transform-runtime');
  })
  .configureBabelPresetEnv((config) => {
    config.useBuiltIns = 'usage';
    config.corejs = '3.23';
  })
  .enableSassLoader()
  .enableVueLoader(() => {}, { version: 3 })

  // optional custom split-chunks
  .configureSplitChunks((splitChunks) => {
    splitChunks.chunks = 'all';
    splitChunks.cacheGroups = {
      vendor: {
        test: /[\\/]node_modules[\\/]/,
        name: 'vendors',
        chunks: 'all',
      },
      coreui: {
        test: /[\\/]node_modules[\\/]@coreui[\\/]/,
        name: 'coreui',
        chunks: 'all',
        priority: 10,
      },
      vue: {
        test: /[\\/]node_modules[\\/]vue[\\/]/,
        name: 'vue',
        chunks: 'all',
        priority: 10,
      },
    };
  })
;

const config = Encore.getWebpackConfig();

// strip out CssMinimizerPlugin if it’s causing trouble
if (config.optimization && Array.isArray(config.optimization.minimizer)) {
  config.optimization.minimizer = config.optimization.minimizer.filter(
    m => m.constructor.name !== 'CssMinimizerPlugin'
  );
}

module.exports = config;
