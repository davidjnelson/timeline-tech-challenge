'use strict';

define([], function() {
    var _timelineData,
        _modelEventHandler,
        _processedEvents = {},
        _currentEventAge = 0,
        _howManySecondsAfterPageLoadDidLastPauseOccur = 0,
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
            // using 'TimelinePlayer.prototype' instead of 'this' so that I can have private members
            if(_playerState === TimelinePlayer.prototype.PLAYING) {
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
                TimelinePlayer.prototype.moveToNextEvent();
            } else if(animationElapsedTime > howLongToShowEvent) {
                TimelinePlayer.prototype.moveToNextEvent();
            }

            if(_modelEventHandler) {
                _modelEventHandler();
            }
        },
        _startTimer = function() {
            _timerLoop();
        },
        TimelinePlayer = function(timelineServerData, timelineData) {
            _modelEventHandler = null;
            _currentEventAge = 0,
            _howManySecondsAfterPageLoadDidLastPauseOccur = 0,
            _needToProcessPause = false,
            _howManySecondsAfterPageLoadDidLastResumeOccur = 0,
            _howManySecondsAfterPageLoadDidLastPlayOccur = 0,
            _timeAtFirstPlay = 0,
            _needToProcessPause = false,
            _howLongAnimationWasPaused = 0,
            _playerState = TimelinePlayer.prototype.NOT_STARTED;
            _timelineData = timelineData;
        };

    TimelinePlayer.prototype.getPlayerState = function() {
        return _playerState;
    };

    TimelinePlayer.prototype.handleModelEvents = function(modelEventHandler) {
        _modelEventHandler = modelEventHandler;
    };

    TimelinePlayer.prototype.changePlayerState = function(requestedState) {
        switch(requestedState) {
            case TimelinePlayer.prototype.PLAYING: {
                switch(_playerState) {
                    case TimelinePlayer.prototype.NOT_STARTED:
                    case TimelinePlayer.prototype.COMPLETED: {
                        _timeAtFirstPlay = _currentTimeInSeconds();
                        _needToProcessPause = false;
                        _howManySecondsAfterPageLoadDidLastPlayOccur = _currentTimeInSeconds();
                        _currentEventAge = _timelineData.getEventAgeByIndex(0);
                        _playerState = requestedState;
                        _timelineData.setAnimationStartTimeByAge(_currentEventAge, _currentTimeInSeconds());

                        _startTimer();
                    }
                    case TimelinePlayer.prototype.PAUSED: {

                    }
                }
            }
            case TimelinePlayer.prototype.COMPLETED: {
                if(_playerState === TimelinePlayer.prototype.PLAYING && requestedState === TimelinePlayer.prototype.COMPLETED) {
                    _needToProcessPause = false;
                    _playerState = TimelinePlayer.prototype.COMPLETED;
                }
            }
            case TimelinePlayer.prototype.PAUSED: {
                if(_playerState === TimelinePlayer.prototype.PLAYING) {
                    _playerState = TimelinePlayer.prototype.PAUSED;
                    _needToProcessPause = true;
                    _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                }
            }
        }

        if(_playerState === TimelinePlayer.prototype.PAUSED && requestedState === TimelinePlayer.prototype.PLAYING) {
            _needToProcessPause = false;
            _playerState = TimelinePlayer.prototype.PLAYING;
            _howManySecondsAfterPageLoadDidLastResumeOccur = _currentTimeInSeconds();
            _startTimer();
        }

        // tell any listeners that state changed
        if(_modelEventHandler) {
            _modelEventHandler();
        }
    };

    TimelinePlayer.prototype.getCurrentEventAge = function() {
        return _currentEventAge;
    };

    TimelinePlayer.prototype.moveToNextEvent = function() {
        for(var i = 0; i < _timelineData.getEvents().length; i++) {
            if((i + 1) === _timelineData.getEvents().length) {
                _playerState = TimelinePlayer.prototype.COMPLETED;
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

    TimelinePlayer.prototype.togglePlayingPaused = function() {
        if(_playerState === TimelinePlayer.prototype.NOT_STARTED ||
            _playerState === TimelinePlayer.prototype.COMPLETED ||
            _playerState === TimelinePlayer.prototype.PAUSED) {
            TimelinePlayer.prototype.changePlayerState(TimelinePlayer.prototype.PLAYING);
        } else if(_playerState === TimelinePlayer.prototype.PLAYING) {
            TimelinePlayer.prototype.changePlayerState(TimelinePlayer.prototype.PAUSED);
        }
    };

    TimelinePlayer.prototype.NOT_STARTED = 'not-started';
    TimelinePlayer.prototype.PLAYING = 'playing';
    TimelinePlayer.prototype.PAUSED = 'paused';
    TimelinePlayer.prototype.COMPLETED = 'completed';

    return TimelinePlayer;
});

// time this event started - how long it paused
