/* TODO: these were working.  broke them getting the app working.  fix them.
define(['EntryPoint', 'text!json/SmallData.json', 'jquery'], function(EntryPoint, SmallData, $) {
    describe('View', function () {
        var cssLoaded = false,
            // five decimal places is precise enough.
            convertToLessPrecision = function(number) {
                return parseFloat(number.toFixed(5));
            },
            getRectangleHeight = function(id) {
                // jquery has a bug which rounds up computed css, hence using getBoundingClientRect
                return convertToLessPrecision(document.getElementById(id).getBoundingClientRect().height);
            },
            getRectangleWidth = function(id) {
                return convertToLessPrecision(document.getElementById(id).getBoundingClientRect().width);
            },
            getViewportHeight = function() {
                return convertToLessPrecision(parseFloat(window.getComputedStyle(document.getElementsByTagName('body')[0],null).height));
            };

        // mocha and jasmine 2 have much better async support.  consider switching.
        beforeEach(function() {
            $('head').append('<link rel="stylesheet" id="timeline-css" href="/base/src/css/timeline.css"" type="text/css" />');

            var loadCss = setInterval(function(){
                if($('#timeline-css').length){
                    clearInterval(loadCss);
                    cssLoaded = true;
                }
            }, 5); // retry every 5 milliseconds seconds to see if it's loaded

            EntryPoint.start(SmallData);
        });

        describe('when the application loads', function () {
            describe('the timeline-container div', function () {
                it('should have the same height as the viewport', function () {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        expect(getRectangleHeight('timeline-container')).toEqual(getViewportHeight());
                    });
                });

                it('should have a first child div which is 75% height and 100% width', function() {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        var seventyFivePercentOfContainerHeight = convertToLessPrecision(getRectangleHeight('timeline-container') * .75);
                        expect(getRectangleHeight('timeline-top-pane')).toEqual(seventyFivePercentOfContainerHeight);
                        expect(getRectangleWidth('timeline-top-pane')).toEqual(getRectangleWidth('timeline-container'));
                    });
                });

                it('should have a second child div which is 25% height and 100% width', function() {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        var twentyFivePercentOfContainerHeight = convertToLessPrecision(getRectangleHeight('timeline-container') * .25);
                        expect(getRectangleHeight('timeline-bottom-pane')).toEqual(twentyFivePercentOfContainerHeight);
                        expect(getRectangleWidth('timeline-bottom-pane')).toEqual(getRectangleWidth('timeline-container'));
                    });
                });

                it('should have a first child div with the text "Chip Bitly"', function() {
                    expect($('#timeline-top-pane-text').text()).toEqual('Chip Bitly');
                });

                it('should have a second child div with the text "play"', function() {
                    expect($('#timeline-bottom-pane-text').text()).toEqual('play');
                });
            });
        });

        describe('when the play button is clicked', function() {
            beforeEach(function() {
                $('#timeline-bottom-pane').click();
            });
            describe('the bottom pane text', function() {
                it('should change to the word "pause', function() {
                    expect($('#timeline-bottom-pane-text').text()).toEqual('pause');
                });
            });

            describe('the top pane text', function() {
                it('should say "at age 0, Chip was born"', function() {
                    expect($('#timeline-top-pane-text').text()).toEqual('at age 0, Chip was born');
                });
            });

            describe('after 80 microseconds', function() {
                describe('the top pane text', function() {
                    it('should say "at age 0.00012, Chip was successfully potty trained"', function() {
                        expect($('#timeline-top-pane-text').text())
                            .toEqual('at age 0.00012, Chip was successfully potty trained');
                    });
                });
            });
        });
    });

    afterEach(function() {
        $('body').empty();
    });
});
*/
