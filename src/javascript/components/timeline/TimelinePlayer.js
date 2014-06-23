'use strict';

define([], function() {
    var _timelineData,
        _modelEventHandler,
        _currentEventAge = 0,
        _howManySecondsAfterPageLoadDidLastPauseOccur = 0,
        _howManySecondsAfterPageLoadDidLastResumeOccur = 0,
        _howManySecondsAfterPageLoadDidLastPlayOccur = 0,
        _timeAtFirstPlay = 0,
        _howLongAnimationWasPaused = 0,
        _playerState,
        _currentTimeInSeconds = function() {
            return performance.now() / 1000;
        },
        _calculateHowLongAnimationWasPaused = function() {
            if(_howManySecondsAfterPageLoadDidLastResumeOccur > _howManySecondsAfterPageLoadDidLastPauseOccur) {
                _howLongAnimationWasPaused = _howManySecondsAfterPageLoadDidLastResumeOccur - _howManySecondsAfterPageLoadDidLastPauseOccur;
            }
        },
        _calculateAnimationElapsedTime = function() {
            return _currentTimeInSeconds() - _howLongAnimationWasPaused - _timelineData.getAnimationStartTimeByAge(_currentEventAge);
        },
        _shouldMoveToNextevent = function() {
            _calculateHowLongAnimationWasPaused();

            // convert to seconds, but keep the microsecond precision
            var howLongToShowEvent = _timelineData.getPlaybackTimeForAge(_currentEventAge),
                animationElapsedTime = _calculateAnimationElapsedTime();

            // using 'TimelinePlayer.prototype' instead of 'this' so that I can have private members
            if(_playerState === TimelinePlayer.prototype.PLAYING) {
                // using requestAnimationFrame and performance.now instead of setinterval for microsecond precision
                requestAnimationFrame(_timerLoop);
            }

            if(animationElapsedTime > howLongToShowEvent) {
                return true;
            }

            return false;
        },
        _timerLoop = function() {
            if(_shouldMoveToNextevent()) {
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
                        _howManySecondsAfterPageLoadDidLastPlayOccur = _currentTimeInSeconds();
                        _currentEventAge = _timelineData.getEventAgeByIndex(0);
                        _timelineData.setAnimationStartTimeByAge(_currentEventAge, _currentTimeInSeconds());
                    }
                }
            }
            case TimelinePlayer.prototype.PAUSED: {
                if(_playerState === TimelinePlayer.prototype.PLAYING) {
                    _howManySecondsAfterPageLoadDidLastPauseOccur = _currentTimeInSeconds();
                }
            }
        }

        if(_playerState === TimelinePlayer.prototype.PAUSED) {
            _howManySecondsAfterPageLoadDidLastResumeOccur = _currentTimeInSeconds();
        }

        _playerState = requestedState;

        if(requestedState === TimelinePlayer.prototype.PLAYING) {
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
