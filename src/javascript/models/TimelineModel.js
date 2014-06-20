'use strict';

define([], function() {
    var _timelineModel,
        _modelEventHandler,
        _processedEvents = {},
        _currentEventAge = 0,
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
                eventCount = _timelineModel.events.length,
                eventCountMinusOne = eventCount - 1,
                playbackStart = 0,
                playbackEnd = 0,
                playbackTime = 0,
                lastEventPlaybackTime;

            for(i; i < eventCount; i++) {
                playbackStart = 2 * _timelineModel.events[i].age;

                if(i < eventCountMinusOne) {
                    playbackEnd = 2 * _timelineModel.events[i + 1].age;
                    playbackTime = playbackEnd - playbackStart;

                    _processedEvents[_timelineModel.events[i].age] = {
                        playbackTime: playbackTime,
                        activity: _timelineModel.events[i].content
                    };
                } else {
                    lastEventPlaybackTime = _timelineModel.age * 2 - playbackStart;

                    _processedEvents[_timelineModel.events[i].age] = {
                        playbackTime: lastEventPlaybackTime,
                        activity: _timelineModel.events[i].content
                    };
                }
            }
        },
        TimelineModel = {
            refreshDataFromServer: function(timelineServerData) {
                _timelineModel = JSON.parse(timelineServerData);
                _calculatePlaybackTimeForEachAge();
            },
            getPlayerState: function() {
                return _playerState;
            },
            getFullName: function() {
                return _timelineModel.firstName + ' ' + _timelineModel.lastName;
            },
            handleModelEvents: function(modelEventHandler) {
                _modelEventHandler = modelEventHandler;
            },
            changePlayerState: function() {
                if(_playerState === this.NOT_STARTED) {
                    _playerState = this.PLAYING;
                    _processedEvents[_currentEventAge].animationStartTime = performance.now();
                }

                _modelEventHandler();
            },
            getTotalPlaybackTime: function() {
                return _timelineModel.age * 2;
            },
            getPlaybackTimeForAge: function(age) {
                return _processedEvents[age].playbackTime;
            },
            getAge: function() {
                return _timelineModel.age;
            },
            getFirstName: function() {
                return _timelineModel.firstName;
            },
            getActivityForAge: function(age) {
                return _processedEvents[age].activity;
            },
            getAgeForCurrentEvent: function() {
                return _currentEventAge;
            },
            getCurrentEventAnimationStartTime: function() {
                return _processedEvents[_currentEventAge].animationStartTime;
            },
            moveToNextEvent: function() {
                for(var i = 0; i < _timelineModel.events.length; i++) {
                    if(_timelineModel.events[i].age === _currentEventAge) {
                        _currentEventAge = _timelineModel.events[i + 1].age;
                        _processedEvents[_currentEventAge].animationStartTime = performance.now();
                        break;
                    }
                }
            },
            NOT_STARTED: 'not-started',
            PLAYING: 'playing',
            PAUSED: 'paused',
            COMPLETED: 'completed'
        },
        _playerState = TimelineModel.NOT_STARTED;

    return TimelineModel;
});
