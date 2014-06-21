'use strict';

define(['models/TimelineModel', 'text!json/SmallData.json'], function(TimelineModel, SmallData) {
    var toFiveDecimals = function(number) {
        // four decimals of precision is precise enough for this test
        return parseFloat(number.toFixed(4));
    };

    describe('Timeline Model', function() {
        beforeEach(function() {
            TimelineModel.refreshDataFromServer(SmallData);
        });

        describe('when the data is set very small for test speed', function() {
            it('should set the playback time to the right interval for each age and associated event', function() {
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(0))).toEqual(0.008);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.004))).toEqual(0.016);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.012))).toEqual(0.010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.017))).toEqual(0.008);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.021))).toEqual(0.012);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.027))).toEqual(0.010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.032))).toEqual(0.010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.037))).toEqual(0.010);
                expect(toFiveDecimals(TimelineModel.getPlaybackTimeForAge(.042))).toEqual(0.008);
            });

            /* ran out of time to complete these
            // allow for tens of microseconds of noise
            describe('when the player state is set to play', function() {
                var startTime = 0,
                    callbacksFired = 0,
                    elapsedMillisecondsWithMicrosecondPrecision = 0;

                afterEach(function() {
                    TimelineModel.changePlayerState(TimelineModel.NOT_STARTED);
                });

                it('should be at event with age 0', function() {
                    TimelineModel.changePlayerState(TimelineModel.PLAYING);

                    expect(TimelineModel.getAgeForCurrentEvent()).toEqual(0);
                    expect(elapsedMillisecondsWithMicrosecondPrecision).toBeGreaterThan(0);
                    expect(elapsedMillisecondsWithMicrosecondPrecision).toBeLessThan(0.3);
                });

                describe('after 8 milliseconds', function() {
                    iit('the current event should be age 0.004', function() {
                        startTime = performance.now();
                        TimelineModel.handleModelEvents(function() {
                            elapsedMillisecondsWithMicrosecondPrecision = performance.now() - startTime;
                            callbacksFired++;

                            // stop the player so we can get accurate measurements
                            if(callbacksFired === 1) {
                                TimelineModel.changePlayerState(TimelineModel.COMPLETED);
                            }
                        });
                        TimelineModel.changePlayerState(TimelineModel.PLAYING);

                        waitsFor(function() {
                            return callbacksFired === 1;
                        }, "event progressed");

                        runs(function () {
                            expect(TimelineModel.getAgeForCurrentEvent()).toEqual(0.004);
                            //expect(elapsedMillisecondsWithMicrosecondPrecision).toBeGreaterThan(0.8);
                            //expect(elapsedMillisecondsWithMicrosecondPrecision).toBeLessThan(1);
                        });
                    });
                })
            });
            */
        });

        describe('when the described person is 46 years old', function() {
            it('should it should have a total playback time of 92 seconds', function() {
                expect(TimelineModel.getTotalPlaybackTime()).toEqual(0.092);
            });
        });
    });
});
