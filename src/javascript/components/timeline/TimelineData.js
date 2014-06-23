define([], function() {
    var _timelineData,
        _safeParseJson = function(json) {
            if(typeof json === 'object') {
                return json;
            }

            return JSON.parse(json);
        },
        _processedEvents = {},
        _calculatePlaybackTimeForEachAge = function() {
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
                lastEventPlaybackTime = 0,
                internalProcessedEvents = {};

            for(i; i < eventCount; i++) {
                playbackStart = 2 * _timelineData.events[i].age;

                if(i < eventCountMinusOne) {
                    playbackEnd = 2 * _timelineData.events[i + 1].age;
                    playbackTime = playbackEnd - playbackStart;

                    internalProcessedEvents[_timelineData.events[i].age] = {
                        playbackTime: playbackTime,
                        activity: _timelineData.events[i].content
                    };
                } else {
                    lastEventPlaybackTime = _timelineData.age * 2 - playbackStart;

                    internalProcessedEvents[_timelineData.events[i].age] = {
                        playbackTime: lastEventPlaybackTime,
                        activity: _timelineData.events[i].content
                    };
                }
            }

            return internalProcessedEvents;
        },
        TimelineData = function(timelineServerData) {
            _timelineData = _safeParseJson(timelineServerData);
            _processedEvents = _calculatePlaybackTimeForEachAge();
        };

    TimelineData.prototype.getFullName = function() {
        return _timelineData.firstName + ' ' + _timelineData.lastName;
    };

    TimelineData.prototype.getTotalPlaybackTime = function() {
        return _timelineData.age * 2;
    };

    TimelineData.prototype.getPlaybackTimeForAge = function(age) {
        return _processedEvents[age].playbackTime;
    };

    TimelineData.prototype.getAge = function() {
        return _timelineData.age;
    };

    TimelineData.prototype.getFirstName = function() {
        return _timelineData.firstName;
    };

    TimelineData.prototype.getActivityForAge = function(age) {
        return _processedEvents[age].activity;
    };

    TimelineData.prototype.setAnimationStartTimeByAge = function(age, animationStartTime) {
        _processedEvents[age].animationStartTime = animationStartTime;
    };

    TimelineData.prototype.getAnimationStartTimeByAge = function(age) {
        return _processedEvents[age].animationStartTime;
    };

    TimelineData.prototype.getEventAgeByIndex = function(index) {
        return _timelineData.events[index].age;
    };

    TimelineData.prototype.getEvents = function() {
        return _timelineData.events;
    };

    return TimelineData;
});
