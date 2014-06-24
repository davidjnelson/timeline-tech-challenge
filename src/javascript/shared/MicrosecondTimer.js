'use strict';

define([], function () {
    // this timer is like setTimeout, except that it can process as fast as 200 microseconds
    var _completedCallback,
        _millisecondsToWait,
        _millisecondsSinceTimerStarted,
        _millisecondsSinceTimerEnded,
        _stop = false,
        _timerLoop = function (millisecondsSincePageLoaded) {
            if(_stop) {
                return;
            } else if (performance.now() >= (_millisecondsSinceTimerStarted + _millisecondsToWait)) {
                _completedCallback();
            } else {
                requestAnimationFrame(_timerLoop);
            }
        },
        _microsecondSetTimeout = function (completedCallback, millisecondsToWait) {
            _millisecondsSinceTimerStarted = performance.now();
            _timerLoop();
        };
    var MicrosecondTimer = function (completedCallback, millisecondsToWait) {
        _completedCallback = completedCallback;
        _millisecondsToWait = millisecondsToWait;
        _millisecondsSinceTimerStarted = 0;
        _stop = false;
    };

    MicrosecondTimer.prototype.execute = function() {
        _microsecondSetTimeout(_completedCallback, _millisecondsToWait);
    };

    MicrosecondTimer.prototype.stop = function() {
        var timeBetweenTimerStartAndStop = performance.now() - _millisecondsSinceTimerStarted;
        _stop = true;

        return timeBetweenTimerStartAndStop;
    };

    return MicrosecondTimer;
});
