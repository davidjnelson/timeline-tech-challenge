'use strict';

define(['shared/MicrosecondTimer', 'components/timeline/TimelinePlayerState'], function(MicrosecondTimer, TimelinePlayerState) {
    var _modelEventHandler,
        _timelinePlayerState,
        _microsecondTimer,
        _start = function() {
            _timelinePlayerState.setPlayerState(TimelinePlayerState.prototype.PLAYING);
            _microsecondTimer = new MicrosecondTimer(_play, _timelinePlayerState.getRemainingMilliseconds());
            _microsecondTimer.execute();
        },
        _play = function() {
            if(_timelinePlayerState.isLastEvent() && _timelinePlayerState.getPlayerState() !== TimelinePlayerState.prototype.COMPLETED) {
                _timelinePlayerState.setPlayerState(TimelinePlayerState.prototype.COMPLETED);
            } else if(_timelinePlayerState.getPlayerState() === TimelinePlayerState.prototype.COMPLETED) {
                _timelinePlayerState.switchToFirstEvent();
                _start();
            } else if(_timelinePlayerState.getPlayerState() === TimelinePlayerState.prototype.PAUSED ||
                _timelinePlayerState.getPlayerState() === TimelinePlayerState.prototype.NOT_STARTED) {
                _start();
            }
            else {
                _timelinePlayerState.switchToNextEvent();
                _start();
            }
        },
        _pause = function() {
            _timelinePlayerState.setPlayerState(TimelinePlayerState.prototype.PAUSED);
            _timelinePlayerState.updatePausedMilliseconds(_microsecondTimer.stop());
        },
        TimelinePlayer = function(timelineData, timelinePlayerState) {
            _timelinePlayerState = timelinePlayerState;
        };

    TimelinePlayer.prototype.togglePlayingPaused = function() {
        if(_timelinePlayerState.getPlayerState() !== TimelinePlayerState.prototype.PLAYING) {
            _play();
        } else {
            _pause();
        }
    };

    return TimelinePlayer;
});
