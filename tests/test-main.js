'use strict';

(function() {

    var specFiles = null;
    var baseUrl = '/base/src/javascript';
    var requirejsCallback = null;

    // if invoked in karma-runner environment
    if (typeof window != 'undefined' && window.__karma__ != undefined) {
        requirejsCallback = window.__karma__.start;

        // looking for *_spec.js files
        specFiles = [];
        for (var file in window.__karma__.files) {
            if (window.__karma__.files.hasOwnProperty(file)) {
                if (/Spec\.js$/.test(file)) {
                    specFiles.push(file);
                }
            }
        }
    }

    requirejs.config({
        baseUrl: baseUrl,

        paths: {
            'jquery': '../../bower_components/jquery/dist/jquery',
            'text': '../../bower_components/requirejs-text/text',
            'chai': '../../node_modules/chai/chai'
        },

        // ask Require.js to load these files (all our tests)
        deps: specFiles,

        // start test run, once Require.js is done
        callback: requirejsCallback
    });
})();
