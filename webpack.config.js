const Encore = require('@symfony/webpack-encore');
const path = require('path');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'production');
}

Encore
    // directory where compiled assets will be stored
    .setOutputPath('Resources/public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/bundles/companyosbackend/build')

    // only needed for CDN's or subdirectory deploy
    //.setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './Resources/app/app.js')

    // enables the Symfony UX Stimulus controller (used in assets/controllers.js)
    //.enableStimulusController('hello')

    // When enabled, Webpack "splits" your files into smaller pieces for greater optimization.
    .splitEntryChunks()

    // will require an extra script tag for runtime.js
    // but, you probably want this, unless you're building a single-page app
    .enableSingleRuntimeChunk()

    /*
     * FEATURE CONFIG
     *
     * Enable & configure other features below. For a full
     * list of features, see:
     * https://symfony.com/doc/current/frontend.html#adding-more-features
     */
    .cleanupOutputBeforeBuild()
    .enableSourceMaps(!Encore.isProduction())
    // enables hashed filenames (e.g. app.abc123.css)
    .enableVersioning(Encore.isProduction())

    // configure Babel
    .configureBabel((config) => {
        config.plugins.push('@babel/plugin-transform-runtime');
    })

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // enables Sass/SCSS support
    .enableSassLoader()

    // uncomment if you use TypeScript
    //.enableTypeScriptLoader()

    // uncomment if you use React
    //.enableReactPreset()

    // uncomment to get integrity="..." attributes on your script & link tags
    // requires WebpackEncoreBundle 1.4 or higher
    //.enableIntegrityHashes(Encore.isProduction())

    // uncomment if you're having problems with a jQuery plugin
    //.autoProvidejQuery()

    // Vue.js support
    .enableVueLoader(() => {}, { version: 3 })

    // Configure chunk splitting for better optimization
    .configureSplitChunks(function(splitChunks) {
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
                priority: 10
            },
            vue: {
                test: /[\\/]node_modules[\\/]vue[\\/]/,
                name: 'vue',
                chunks: 'all',
                priority: 10
            }
        };
    })
;

// CSS-Minimierung deaktivieren, da sie Konflikte verursacht
const config = Encore.getWebpackConfig();

// CSS-Minimizer entfernen
if (config.optimization && config.optimization.minimizer) {
    config.optimization.minimizer = config.optimization.minimizer.filter(
        minimizer => minimizer.constructor.name !== 'CssMinimizerPlugin'
    );
}

module.exports = config; 