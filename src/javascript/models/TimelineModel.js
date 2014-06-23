'use strict';

define([], function() {
    var _timelineModel,
        _timelineData,
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
                animationStartTime = _timelineData.getAnimationStartTimeByAge(_currentEventAge),
                howLongToShowEvent = _timelineData.getPlaybackTimeForAge(_currentEventAge),
                animationElapsedTime,
                timeThisEventShouldShow,
                timeSinceEventStarted;

            if(_howManySecondsAfterPageLoadDidLastResumeOccur > _howManySecondsAfterPageLoadDidLastPauseOccur) {
                _howLongAnimationWasPaused = _howManySecondsAfterPageLoadDidLastResumeOccur - _howManySecondsAfterPageLoadDidLastPauseOccur;
            } else {
                _howLongAnimationWasPaused = 0;
            }

            animationElapsedTime = currentTime - _howLongAnimationWasPaused - animationStartTime;
            timeThisEventShouldShow = _timelineData.getPlaybackTimeForAge(_currentEventAge);
            timeSinceEventStarted = _currentTimeInSeconds() - _timelineData.getAnimationStartTimeByAge(_currentEventAge);

            if(_needToProcessPause && (_howLongAnimationWasPaused + timeSinceEventStarted > timeThisEventShouldShow)) {
                TimelineModel.prototype.moveToNextEvent();
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
        TimelineModel = function(timelineServerData, timelineData) {
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
            _timelineData = timelineData;
        };

    TimelineModel.prototype.getPlayerState = function() {
        return _playerState;
    };

    TimelineModel.prototype.handleModelEvents = function(modelEventHandler) {
        _modelEventHandler = modelEventHandler;
    };

    TimelineModel.prototype.changePlayerState = function(requestedState) {
        switch(requestedState) {
            case TimelineModel.prototype.PLAYING: {
                switch(_playerState) {
                    case TimelineModel.prototype.NOT_STARTED:
                    case TimelineModel.prototype.COMPLETED: {
                        _timeAtFirstPlay = _currentTimeInSeconds();
                        _needToProcessPause = false;
                        _howManySecondsAfterPageLoadDidLastPlayOccur = _currentTimeInSeconds();
                        _currentEventAge = _timelineData.getEventAgeByIndex(0);
                        _playerState = requestedState;
                        _timelineData.setAnimationStartTimeByAge(_currentEventAge, _currentTimeInSeconds());

                        _startTimer();
                    }
                    case TimelineModel.prototype.PAUSED: {

                    }
                }
            }
            case TimelineModel.prototype.COMPLETED: {
                if(_playerState === TimelineModel.prototype.PLAYING && requestedState === TimelineModel.prototype.COMPLETED) {
                    _needToProcessPause = false;
                    _playerState = TimelineModel.prototype.COMPLETED;
                }
            }
            case TimelineModel.prototype.PAUSED: {
                if(_playerState === TimelineModel.prototype.PLAYING) {
                    _playerState = TimelineModel.prototype.PAUSED;
                    _needToProcessPause = true;
                    _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                }
            }
        }

        if(_playerState === TimelineModel.prototype.PAUSED && requestedState === TimelineModel.prototype.PLAYING) {
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

    TimelineModel.prototype.getCurrentEventAge = function() {
        return _currentEventAge;
    };

    TimelineModel.prototype.moveToNextEvent = function() {
        for(var i = 0; i < _timelineData.getEvents().length; i++) {
            if((i + 1) === _timelineData.getEvents().length) {
                _playerState = TimelineModel.prototype.COMPLETED;
            } else if (_timelineData.getEvents()[i].age === _currentEventAge) {
                _currentEventAge = _timelineData.getEvents()[i + 1].age;
                _timelineData.setAnimationStartTimeByAge(_currentEventAge, _currentTimeInSeconds());
                _howLongAnimationWasPaused = 0;
                _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                return true;
            }
        }

        return false;
    };

    TimelineModel.prototype.togglePlayingPaused = function() {
        if(_playerState === TimelineModel.prototype.NOT_STARTED ||
            _playerState === TimelineModel.prototype.COMPLETED ||
            _playerState === TimelineModel.prototype.PAUSED) {
            TimelineModel.prototype.changePlayerState(TimelineModel.prototype.PLAYING);
        } else if(_playerState === TimelineModel.prototype.PLAYING) {
            TimelineModel.prototype.changePlayerState(TimelineModel.prototype.PAUSED);
        }
    };

    TimelineModel.prototype.NOT_STARTED = 'not-started';
    TimelineModel.prototype.PLAYING = 'playing';
    TimelineModel.prototype.PAUSED = 'paused';
    TimelineModel.prototype.COMPLETED = 'completed';

    return TimelineModel;
});

// time this event started - how long it paused
