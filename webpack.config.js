const Encore = require('@symfony/webpack-encore');
const { VueLoaderPlugin } = require('vue-loader');
const fs = require('fs');
const path = require('path');

// Manually configure the runtime environment if not already configured yet by the "encore" command.
// It's useful when you use tools that rely on webpack.config.js file.
if (!Encore.isRuntimeEnvironmentConfigured()) {
    Encore.configureRuntimeEnvironment(process.env.NODE_ENV || 'dev');
}

/*
|--------------------------------------------------------------------------
| Encore webpack configuration
|--------------------------------------------------------------------------
|
| This file is read by Webpack Encore. If you're using the assets
| command, you probably don't need to modify this file manually.
| Check the webpack.config.js file if you need to customize the
| webpack config *before* calling Encore.
|
*/

// Backup-Funktion für alte Assets
function backupOldAssets() {
    const buildPath = 'Resources/public/build';
    const backupPath = 'Resources/public/build.backup';
    
    if (fs.existsSync(buildPath)) {
        // Altes Backup entfernen falls vorhanden
        if (fs.existsSync(backupPath)) {
            fs.rmSync(backupPath, { recursive: true, force: true });
        }
        
        // Aktuelles Build als Backup kopieren
        fs.cpSync(buildPath, backupPath, { recursive: true });
        console.log('✅ Alte Assets gesichert');
    }
}

// Backup erstellen vor dem Build
backupOldAssets();

Encore
    // directory where compiled assets will be stored
    // This will be copied to public/bundles/companyosbackend/build/ by Symfony
    .setOutputPath('Resources/public/build/')
    // public path used by the web server to access the output path
    .setPublicPath('/bundles/companyosbackend/build')
    // manifest key prefix for the manifest.json file
    .setManifestKeyPrefix('build/')

    /*
     * ENTRY CONFIG
     *
     * Each entry will result in one JavaScript file (e.g. app.js)
     * and one CSS file (e.g. app.css) if your JavaScript imports CSS.
     */
    .addEntry('app', './Resources/app/app.js')

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
    // enables hashed filenames (e.g. app.abc123.css) - IMMER aktiviert für Versioning
    .enableVersioning(true)

    // enables and configure @babel/preset-env polyfills
    .configureBabelPresetEnv((config) => {
        config.useBuiltIns = 'usage';
        config.corejs = '3.23';
    })

    // Vue.js support
    .enableVueLoader(() => {}, {
        version: 3,
        runtimeCompilerBuild: false,
        useJsx: false
    })
    .enableSassLoader();

const config = Encore.getWebpackConfig();

// Post-Build Hook für Cleanup
config.plugins.push({
    apply: (compiler) => {
        compiler.hooks.afterEmit.tap('CleanupBackup', () => {
            const backupPath = 'Resources/public/build.backup';
            if (fs.existsSync(backupPath)) {
                fs.rmSync(backupPath, { recursive: true, force: true });
                console.log('✅ Backup entfernt (Build erfolgreich)');
            }
        });
    }
});

module.exports = config; 