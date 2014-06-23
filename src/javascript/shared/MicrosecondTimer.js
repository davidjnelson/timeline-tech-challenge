'use strict';

define([], function () {
    var _completedCallback,
        _millisecondsToWait,
        _millisecondsSinceTimerStarted,
    // TODO: get this down to the microsecond precision level.  as is, it's no better than setTimeout.
        _timerLoop = function (millisecondsSincePageLoaded) {
            if (performance.now() >= (_millisecondsSinceTimerStarted + _millisecondsToWait)) {
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
    };

    MicrosecondTimer.prototype.execute = function() {
        _microsecondSetTimeout(_completedCallback, _millisecondsToWait);
    };

    return MicrosecondTimer;
});
