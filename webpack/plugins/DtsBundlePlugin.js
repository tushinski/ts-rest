
function DtsBundlePlugin(options){
    this.apply = function (compiler) {
        compiler.hooks.done.tap('DtsBundlePlugin', function() {
            const dts = require('dts-bundle');
            dts.bundle(options);
        });
    };
}

module.exports = { DtsBundlePlugin };