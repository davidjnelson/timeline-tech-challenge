'use strict';

define([], function() {
    var _timelineData,
        TimelineEventCalculator = function(timelineData) {
            _timelineData = timelineData;
        };

    TimelineEventCalculator.prototype.calculateEventPlaybackTimes = function() {
        /*
         the algorithm:
         --------------
         playback start = 2 * age at event
         playback end = 2 * next age
         playback time = playback end - playback start (except for the last entry)
         playback time for the last entry = current age * 2 - playback start
         */

        var i = 0,
            eventCount = _timelineData.events.length,
            eventCountMinusOne = eventCount - 1,
            playbackStart = 0,
            playbackEnd = 0,
            playbackTime = 0,
            processedEvents = {},
            currentEvent = {};

        for(i; i < eventCount; i++) {
            playbackStart = 2 * _timelineData.events[i].age;
            currentEvent = {
                age: _timelineData.events[i].age,
                activity: _timelineData.events[i].content,
                elapsedTime: 0
            };

            if(i < eventCountMinusOne) {
                playbackEnd = 2 * _timelineData.events[i + 1].age;
                playbackTime = playbackEnd - playbackStart;

                currentEvent.playbackTime = playbackTime;
                currentEvent.nextAge = _timelineData.events[i + 1].age;
                currentEvent.isLastEvent = false;
            } else {
                playbackTime = _timelineData.age * 2 - playbackStart;

                currentEvent.playbackTime = playbackTime;
                currentEvent.isLastEvent = true;
            }

            processedEvents[_timelineData.events[i].age] = currentEvent;
        }

        return processedEvents;
    };

    return TimelineEventCalculator;
});
