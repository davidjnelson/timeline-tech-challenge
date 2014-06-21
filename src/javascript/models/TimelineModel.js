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
        _currentTimeInSeconds = function() {
            return performance.now() / 1000;
        },
        _timerLoop = function(timeFromRequestAnimationFrame) {
            if(TimelineModel.getPlayerState() === TimelineModel.PLAYING) {
                // using requestAnimationFrame and performance.now instead of setinterval for microsecond precision
                requestAnimationFrame(_timerLoop);
            }

            // convert to seconds, but keep the microsecond precision
            var currentTime = _currentTimeInSeconds(),
                animationStartTime = TimelineModel.getCurrentEventAnimationStartTime(),
                howLongToShowEvent = TimelineModel.getPlaybackTimeForAge(TimelineModel.getAgeForCurrentEvent());

            if(_howManySecondsAfterPageLoadDidLastResumeOccur > _howManySecondsAfterPageLoadDidLastPauseOccur) {
                _howLongAnimationWasPaused = _howManySecondsAfterPageLoadDidLastResumeOccur - _howManySecondsAfterPageLoadDidLastPauseOccur;
            } else {
                _howLongAnimationWasPaused = 0;
            }
                var animationElapsedTime = currentTime - _howLongAnimationWasPaused - animationStartTime;

            TimelineModel.timeSinceFirstPlay = _timeAtFirstPlay;
            TimelineModel.timeSinceLastPause = _howManySecondsAfterPageLoadDidLastPauseOccur;
            TimelineModel.timeSinceLastResume = _howManySecondsAfterPageLoadDidLastResumeOccur;
            TimelineModel.timeSincePageLoad = _currentTimeInSeconds();
            TimelineModel.timeThisEventShouldShow = TimelineModel.getPlaybackTimeForAge(TimelineModel.getAgeForCurrentEvent());
            TimelineModel.timeSinceEventStarted = _currentTimeInSeconds() - _processedEvents[_currentEventAge].animationStartTime;
            TimelineModel.howLongAnimationWasPaused = _howLongAnimationWasPaused;

            if(TimelineModel.getPlayerState() === TimelineModel.PAUSED) {
                var breakpoint = 'the';
            }

            if(_needToProcessPause) {
                if(_howLongAnimationWasPaused + TimelineModel.timeSinceEventStarted > TimelineModel.timeThisEventShouldShow) {
                    TimelineModel.moveToNextEvent();
                }
            } else if(animationElapsedTime > howLongToShowEvent) {
                TimelineModel.moveToNextEvent();
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
            changePlayerState: function(requestedState) {
                // if transitioning from not started to playing, or from completed to playing,
                // start the timer and store the current time
                if((_playerState === this.NOT_STARTED && requestedState === this.PLAYING) ||
                    (_playerState === this.COMPLETED && requestedState === this.PLAYING)) {
                    _timeAtFirstPlay = _currentTimeInSeconds();
                    _needToProcessPause = false;
                    _howManySecondsAfterPageLoadDidLastPlayOccur = _currentTimeInSeconds();

                    // if restarting the animation, set the current event age back to the first value
                    if(_playerState === this.COMPLETED && requestedState === this.PLAYING) {
                        _currentEventAge = _timelineModel.events[0].age;
                    }

                    _playerState = requestedState;
                    _processedEvents[_currentEventAge].animationStartTime = _currentTimeInSeconds();
                    // send the message to update any listeners even before we start the timer
                    if(_modelEventHandler) {
                        _modelEventHandler();
                    }
                    _startTimer();
                } else if(_playerState === this.PLAYING && requestedState === this.COMPLETED) {
                    _needToProcessPause = false;

                    // if transitioning from playing to completed
                    _playerState = this.COMPLETED;
                } else if(_playerState === this.PLAYING && requestedState === this.PAUSED) {
                    // if the player is paused
                    _playerState = this.PAUSED;
                    _needToProcessPause = true;
                    _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                } else if(_playerState === this.PAUSED && requestedState === this.PLAYING) {
                    _needToProcessPause = false;
                    _playerState = this.PLAYING;
                    _howManySecondsAfterPageLoadDidLastResumeOccur = _currentTimeInSeconds();
                    _startTimer();
                }

                // tell any listeners that state changed
                if(_modelEventHandler) {
                    _modelEventHandler();
                }
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
                    if((i + 1) === _timelineModel.events.length) {
                        _playerState = this.COMPLETED;
                    } else if (_timelineModel.events[i].age === _currentEventAge) {
                        _currentEventAge = _timelineModel.events[i + 1].age;
                        _processedEvents[_currentEventAge].animationStartTime = _currentTimeInSeconds();
                        _howLongAnimationWasPaused = 0;
                        TimelineModel.howLongAnimationWasPaused = _howLongAnimationWasPaused;
                        _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                        return true;
                    }
                }

                return false;
            },
            NOT_STARTED: 'not-started',
            PLAYING: 'playing',
            PAUSED: 'paused',
            COMPLETED: 'completed'
        },
        _playerState = TimelineModel.NOT_STARTED;

    return TimelineModel;
});

// time this event started - how long it paused
