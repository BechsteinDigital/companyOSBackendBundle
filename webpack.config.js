// webpack.config.js
const Encore = require('@symfony/webpack-encore');
const path = require('path');

// If the runtime env isn’t already configured (e.g. when using tools that just load this file)
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'production');
}

Encore
    // 1) compile into public/build
    .setOutputPath('public/build/')
    .setPublicPath('/build')

    // 2) your single entry
    .addEntry('app', './Resources/app/app.js')

    // 3) optimization
    .splitEntryChunks()
    .enableSingleRuntimeChunk()
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    .enableVersioning(Encore.isProduction())

    // 4) Babel & polyfills
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-transform-runtime');
    })
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // 5) Sass & Vue
    .enableSassLoader()
    .enableVueLoader(() => {}, { version: 3 })

    // 6) custom split-chunks cacheGroups
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

// Remove CssMinimizerPlugin if present
if (config.optimization && Array.isArray(config.optimization.minimizer)) {
    config.optimization.minimizer = config.optimization.minimizer.filter(
        minimizer => minimizer.constructor.name !== 'CssMinimizerPlugin'
    );
}

module.exports = config;