// webpack.config.js (project root)
const Encore = require('@symfony/webpack-encore');
const path   = require('path');

if (!Encore.isRuntimeEnvironmentConfigured()) {
  Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'production');
}

Encore
  .setOutputPath('public/build/')
  .setPublicPath('/build')

  // your main app entry
  .addEntry('app', path.resolve(__dirname, 'vendor/companyos/backend/Resources/app/app.js'))
  
  // let us import bundle sources directly
  .addAliases({
    '@CompanyOSBackend': path.resolve(__dirname, 'vendor/companyosbackend/Resources/public/src')
  })

  // all your optimization & loaders…
  .splitEntryChunks()
  .enableSingleRuntimeChunk()
  .cleanupOutputBeforeBuild()
  .enableSourceMaps(!Encore.isProduction())
  .enableVersioning(Encore.isProduction())
  .configureBabel(cfg => cfg.plugins.push('@babel/plugin-transform-runtime'))
  .configureBabelPresetEnv(cfg => {
    cfg.useBuiltIns = 'usage';
    cfg.corejs     = '3.23';
  })
  .enableSassLoader()
  .enableVueLoader(() => {}, { version: 3 })
  .configureSplitChunks(split => {
    split.chunks = 'all';
    split.cacheGroups = {
      vendor: { test: /[\\/]node_modules[\\/]/, name: 'vendors', chunks: 'all' },
      coreui: { test: /[\\/]node_modules[\\/]@coreui[\\/]/, name: 'coreui', chunks: 'all', priority: 10 },
      vue:    { test: /[\\/]node_modules[\\/]vue[\\/]/,   name: 'vue',    chunks: 'all', priority: 10 },
    };
  })
;

const config = Encore.getWebpackConfig();

// strip CssMinimizerPlugin if you still need
if (config.optimization?.minimizer) {
  config.optimization.minimizer = config.optimization.minimizer.filter(
    m => m.constructor.name !== 'CssMinimizerPlugin'
  );
}

module.exports = config;