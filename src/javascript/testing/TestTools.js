define(['EntryPoint'], function(EntryPoint) {
    var cssLoaded = false,
        templatedRendered = false;

    return {
        // five decimal places is precise enough.
        convertToLessPrecision: function(number) {
            return parseFloat(number.toFixed(5));
        },
        getRectangleHeight: function(id) {
            // jquery has a bug which rounds up computed css, hence using getBoundingClientRect
            return this.convertToLessPrecision(document.getElementById(id).getBoundingClientRect().height);
        },
        getRectangleWidth: function(id) {
            return this.convertToLessPrecision(document.getElementById(id).getBoundingClientRect().width);
        },
        getViewportHeight:  function() {
            return this.convertToLessPrecision(parseFloat(window.getComputedStyle(document.getElementsByTagName('body')[0],null).height));
        },
        loadTestFixtures: function(testData, doneLoadingNotificationCallback) {
            templatedRendered = false;

            // testing the css loading isn't necessary since it will be inlined by the build anyway,
            // so no need to set it to false on each run
            if (!cssLoaded) {
                $('head').append('<link rel="stylesheet" id="timeline-css" href="/base/src/css/timeline.css"" type="text/css" />');

                var loadCss = setInterval(function () {
                    if ($('#timeline-css').length) {
                        clearInterval(loadCss);
                        cssLoaded = true;
                        if(templatedRendered) {
                            doneLoadingNotificationCallback();
                        }
                    }
                }, 5); // retry every 5 milliseconds seconds to see if it's loaded
            }

            EntryPoint.start(testData, function () {
                templatedRendered = true;
                if(cssLoaded) {
                    doneLoadingNotificationCallback();
                }
            });
        },
        teardownTestFixtures: function() {
            EntryPoint.stop();
        }
    }
});
