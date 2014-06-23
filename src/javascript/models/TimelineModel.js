'use strict';

define([], function() {
    var _timelineModel,
        _modelEventHandler,
        _processedEvents = {},
        _currentEventAge = 0,
        _howManySecondsAfterPageLoadDidLastPauseOccur = 0,
        _needToProcessPause = false,
        _howManySecondsAfterPageLoadDidLastResumeOccur = 0,
        _howManySecondsAfterPageLoadDidLastPlayOccur = 0,
        _timeAtFirstPlay = 0,
        _needToProcessPause = false,
        _howLongAnimationWasPaused = 0,
        _playerState,
        _safeParseJson = function(json) {
            if(typeof json === 'object') {
                return json;
            }

            return JSON.parse(json);
        },
        _currentTimeInSeconds = function() {
            return performance.now() / 1000;
        },
        _timerLoop = function(timeFromRequestAnimationFrame) {
            // using 'TimelineModel.prototype' instead of 'this' so that I can have private members
            if(_playerState === TimelineModel.prototype.PLAYING) {
                // using requestAnimationFrame and performance.now instead of setinterval for microsecond precision
                requestAnimationFrame(_timerLoop);
            }

            // convert to seconds, but keep the microsecond precision
            var currentTime = _currentTimeInSeconds(),
                animationStartTime = TimelineModel.prototype.getCurrentEventAnimationStartTime(),
                howLongToShowEvent = TimelineModel.prototype.getPlaybackTimeForAge(TimelineModel.prototype.getAgeForCurrentEvent());

            if(_howManySecondsAfterPageLoadDidLastResumeOccur > _howManySecondsAfterPageLoadDidLastPauseOccur) {
                _howLongAnimationWasPaused = _howManySecondsAfterPageLoadDidLastResumeOccur - _howManySecondsAfterPageLoadDidLastPauseOccur;
            } else {
                _howLongAnimationWasPaused = 0;
            }
                var animationElapsedTime = currentTime - _howLongAnimationWasPaused - animationStartTime;

            TimelineModel.prototype.timeSinceFirstPlay = _timeAtFirstPlay;
            TimelineModel.prototype.timeSinceLastPause = _howManySecondsAfterPageLoadDidLastPauseOccur;
            TimelineModel.prototype.timeSinceLastResume = _howManySecondsAfterPageLoadDidLastResumeOccur;
            TimelineModel.prototype.timeSincePageLoad = _currentTimeInSeconds();
            TimelineModel.prototype.timeThisEventShouldShow = TimelineModel.prototype.getPlaybackTimeForAge(TimelineModel.prototype.getAgeForCurrentEvent());
            TimelineModel.prototype.timeSinceEventStarted = _currentTimeInSeconds() - _processedEvents[_currentEventAge].animationStartTime;
            TimelineModel.prototype.howLongAnimationWasPaused = _howLongAnimationWasPaused;

            if(TimelineModel.prototype.getPlayerState() === TimelineModel.prototype.PAUSED) {
                var breakpoint = 'the';
            }

            if(_needToProcessPause) {
                if(_howLongAnimationWasPaused + TimelineModel.prototype.timeSinceEventStarted > TimelineModel.prototype.timeThisEventShouldShow) {
                    TimelineModel.prototype.moveToNextEvent();
                }
            } else if(animationElapsedTime > howLongToShowEvent) {
                TimelineModel.prototype.moveToNextEvent();
            }

            if(_modelEventHandler) {
                _modelEventHandler();
            }
        },
        _startTimer = function() {
            _timerLoop();
        },
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
                lastEventPlaybackTime = 0,
                internalProcessedEvents = {};

            for(i; i < eventCount; i++) {
                playbackStart = 2 * _timelineModel.events[i].age;

                if(i < eventCountMinusOne) {
                    playbackEnd = 2 * _timelineModel.events[i + 1].age;
                    playbackTime = playbackEnd - playbackStart;

                    internalProcessedEvents[_timelineModel.events[i].age] = {
                        playbackTime: playbackTime,
                        activity: _timelineModel.events[i].content
                    };
                } else {
                    lastEventPlaybackTime = _timelineModel.age * 2 - playbackStart;

                    internalProcessedEvents[_timelineModel.events[i].age] = {
                        playbackTime: lastEventPlaybackTime,
                        activity: _timelineModel.events[i].content
                    };
                }
            }

            return internalProcessedEvents;
        },
        TimelineModel = function(timelineServerData) {
            _modelEventHandler = null;
            _currentEventAge = 0,
            _howManySecondsAfterPageLoadDidLastPauseOccur = 0,
            _needToProcessPause = false,
            _howManySecondsAfterPageLoadDidLastResumeOccur = 0,
            _howManySecondsAfterPageLoadDidLastPlayOccur = 0,
            _timeAtFirstPlay = 0,
            _needToProcessPause = false,
            _howLongAnimationWasPaused = 0,
            _playerState = TimelineModel.prototype.NOT_STARTED;
            _timelineModel = _safeParseJson(timelineServerData);
            _processedEvents = _calculatePlaybackTimeForEachAge();
        };

    TimelineModel.prototype.getPlayerState = function() {
        return _playerState;
    };

    TimelineModel.prototype.getFullName = function() {
        return _timelineModel.firstName + ' ' + _timelineModel.lastName;
    };

    TimelineModel.prototype.handleModelEvents = function(modelEventHandler) {
        _modelEventHandler = modelEventHandler;
    };

    TimelineModel.prototype.changePlayerState = function(requestedState) {
        // if transitioning from not started to playing, or from completed to playing,
        // start the timer and store the current time
        if((_playerState === TimelineModel.prototype.NOT_STARTED && requestedState === TimelineModel.prototype.PLAYING) ||
            (_playerState === TimelineModel.prototype.COMPLETED && requestedState === TimelineModel.prototype.PLAYING)) {
            _timeAtFirstPlay = _currentTimeInSeconds();
            _needToProcessPause = false;
            _howManySecondsAfterPageLoadDidLastPlayOccur = _currentTimeInSeconds();

            // if restarting the animation, set the current event age back to the first value
            if(_playerState === TimelineModel.prototype.COMPLETED && requestedState === TimelineModel.prototype.PLAYING) {
                _currentEventAge = _timelineModel.events[0].age;
            }

            _playerState = requestedState;
            _processedEvents[_currentEventAge].animationStartTime = _currentTimeInSeconds();
            // send the message to update any listeners even before we start the timer
            if(_modelEventHandler) {
                _modelEventHandler();
            }
            _startTimer();
        } else if(_playerState === TimelineModel.prototype.PLAYING && requestedState === TimelineModel.prototype.COMPLETED) {
            _needToProcessPause = false;

            // if transitioning from playing to completed
            _playerState = TimelineModel.prototype.COMPLETED;
        } else if(_playerState === TimelineModel.prototype.PLAYING && requestedState === TimelineModel.prototype.PAUSED) {
            // if the player is paused
            _playerState = TimelineModel.prototype.PAUSED;
            _needToProcessPause = true;
            _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
        } else if(_playerState === TimelineModel.prototype.PAUSED && requestedState === TimelineModel.prototype.PLAYING) {
            _needToProcessPause = false;
            _playerState = TimelineModel.prototype.PLAYING;
            _howManySecondsAfterPageLoadDidLastResumeOccur = _currentTimeInSeconds();
            _startTimer();
        }

        // tell any listeners that state changed
        if(_modelEventHandler) {
            _modelEventHandler();
        }
    };

    TimelineModel.prototype.getTotalPlaybackTime = function() {
        return _timelineModel.age * 2;
    };

    TimelineModel.prototype.getPlaybackTimeForAge = function(age) {
        return _processedEvents[age].playbackTime;
    };

    TimelineModel.prototype.getAge = function() {
        return _timelineModel.age;
    };

    TimelineModel.prototype.getFirstName = function() {
        return _timelineModel.firstName;
    };

    TimelineModel.prototype.getActivityForAge = function(age) {
        return _processedEvents[age].activity;
    };

    TimelineModel.prototype.getAgeForCurrentEvent = function() {
        return _currentEventAge;
    };

    TimelineModel.prototype.getCurrentEventAnimationStartTime = function() {
        return _processedEvents[_currentEventAge].animationStartTime;
    };

    TimelineModel.prototype.moveToNextEvent = function() {
        for(var i = 0; i < _timelineModel.events.length; i++) {
            if((i + 1) === _timelineModel.events.length) {
                _playerState = TimelineModel.prototype.COMPLETED;
            } else if (_timelineModel.events[i].age === _currentEventAge) {
                _currentEventAge = _timelineModel.events[i + 1].age;
                _processedEvents[_currentEventAge].animationStartTime = _currentTimeInSeconds();
                _howLongAnimationWasPaused = 0;
                TimelineModel.prototype.howLongAnimationWasPaused = _howLongAnimationWasPaused;
                _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                return true;
            }
        }

        return false;
    };

    TimelineModel.prototype.NOT_STARTED = 'not-started';
    TimelineModel.prototype.PLAYING = 'playing';
    TimelineModel.prototype.PAUSED = 'paused';
    TimelineModel.prototype.COMPLETED = 'completed';

    return TimelineModel;
});

// time this event started - how long it paused
