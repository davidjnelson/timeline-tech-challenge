define(['EntryPoint', 'text!json/TimelineData.json', 'jquery'], function(EntryPoint, TimelineData, $) {
    describe('View', function () {
        describe('when the application loads', function () {
            describe('the timeline-container div', function () {
                var cssLoaded = false,
                    getRectangleHeight = function(id) {
                        // jquery has a bug which rounds up computed css, hence using getBoundingClientRect
                        return document.getElementById(id).getBoundingClientRect().height;
                    },
                    getRectangleWidth = function(id) {
                        return document.getElementById(id).getBoundingClientRect().width;
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

                    EntryPoint.start(TimelineData);
                });

                it('should have the same height as the viewport', function () {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        expect(getRectangleHeight('timeline-container')).toEqual(
                            parseFloat(window.getComputedStyle(document.getElementsByTagName('body')[0],null).height));
                    });
                });

                it('should have a first child div which is 75% height and 100% width', function() {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        var seventyFivePercentOfContainerHeight = getRectangleHeight('timeline-container') * .75;
                        expect(getRectangleHeight('timeline-top-pane')).toEqual(seventyFivePercentOfContainerHeight);
                        expect(getRectangleWidth('timeline-top-pane')).toEqual(getRectangleWidth('timeline-container'));
                    });
                });

                it('should have a second child div which is 25% height and 100% width', function() {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        var twentyFivePercentOfContainerHeight = getRectangleHeight('timeline-container') * .25;
                        expect(getRectangleHeight('timeline-bottom-pane')).toEqual(twentyFivePercentOfContainerHeight);
                        expect(getRectangleWidth('timeline-bottom-pane')).toEqual(getRectangleWidth('timeline-container'));
                    });
                });

                it('should have a first child div with the name of the individual who is represented by the timeline', function() {
                    expect($('#timeline-top-pane-text').text()).toEqual('Chip Bitly');
                });

                it('should have a second child div with the text "play"', function() {
                    expect($('#timeline-bottom-pane-text').text()).toEqual('play');
                });

                afterEach(function() {
                    $('body').empty();
                });
            })
        })
    });
});
