'use strict';

define([], function() {
    var _remainingTime,
        _processedEvents = {},
        _playerState,
        _currentEvent,
        _firstEvent,
        _stateChangedEventHandler,
        _pausedMilliseconds = 0,
        _convertSecondsToMilliseconds = function(seconds) {
            return seconds * 1000;
        },
        TimelinePlayerState = function(processedEvents) {
            _processedEvents = processedEvents;
            _playerState = TimelinePlayerState.prototype.NOT_STARTED;
            _currentEvent = _processedEvents[0];
            _firstEvent = _processedEvents[0];
        };

    TimelinePlayerState.prototype.NOT_STARTED = 'not-started';
    TimelinePlayerState.prototype.PLAYING = 'playing';
    TimelinePlayerState.prototype.PAUSED = 'paused';
    TimelinePlayerState.prototype.COMPLETED = 'completed';

    Object.defineProperty(TimelinePlayerState.prototype, 'currentEventAge', {
        get: function() {
            return _currentEvent.age;
        }
    });

    Object.defineProperty(TimelinePlayerState.prototype, 'currentActivity', {
        get: function() {
            return _currentEvent.activity;
        }
    });

    TimelinePlayerState.prototype.getPlayerState = function() {
        return _playerState;
    };

    TimelinePlayerState.prototype.setPlayerState = function(requestedState) {
        _playerState = requestedState;

        if(_stateChangedEventHandler) {
            _stateChangedEventHandler();
        }
    };

    TimelinePlayerState.prototype.isLastEvent = function() {
        return _currentEvent.isLastEvent;
    };

    TimelinePlayerState.prototype.switchToNextEvent = function() {
        _pausedMilliseconds = 0;
        _currentEvent = _processedEvents[_currentEvent.nextAge];
    };

    TimelinePlayerState.prototype.getRemainingMilliseconds = function() {
        return _convertSecondsToMilliseconds(_currentEvent.playbackTime) - _pausedMilliseconds;
    };

    TimelinePlayerState.prototype.updatePausedMilliseconds = function(newPortionOfPausedMilliseconds) {
        _pausedMilliseconds += newPortionOfPausedMilliseconds;
    };

    TimelinePlayerState.prototype.setStateChangedEventHandler = function(stateChangedEventHandler) {
        _stateChangedEventHandler = stateChangedEventHandler;
    };

    TimelinePlayerState.prototype.switchToFirstEvent = function() {
        _pausedMilliseconds = 0;
        _currentEvent = _firstEvent;
    };

    return TimelinePlayerState;
});
