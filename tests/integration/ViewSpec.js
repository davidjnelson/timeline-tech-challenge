define(['views/TimelineView', 'jquery'], function(TimelineView, $) {
    describe('View', function () {
        describe('when the application loads', function () {
            describe('the timeline-container div', function () {
                var cssLoaded = false;

                // mocha and jasmine 2 have much better async support.  consider switching.
                beforeEach(function() {
                    $('head').append('<link rel="stylesheet" id="timeline-css" href="/base/src/css/timeline.css"" type="text/css" />');

                    var loadCss = setInterval(function(){
                        if($('#timeline-css').length){
                            clearInterval(loadCss);
                            cssLoaded = true;
                        }
                    }, 5); // retry every 5 milliseconds seconds to see if it's loaded

                    TimelineView.render($('body'));
                });

                it('should have the same height as the viewport', function () {
                    waitsFor(function() {
                        return cssLoaded;
                    }, "the css to load");

                    runs(function () {
                        expect(parseFloat($('#timeline-container').css('height'))).toEqual(document.documentElement.clientHeight);
                    });
                });

                afterEach(function() {
                    $('body').empty();
                })
            })
        })
    });
});
