define([], function () {
    var _microsecondSetTimeoutCompletedCallback,
        _microsecondSetTimeoutMillisecondsToWait,
        _millisecondsSinceTestStarted,
    // TODO: get this down to the microsecond precision level.  as is, it's no better than setTimeout.
        _timerLoop = function (millisecondsSincePageLoaded) {
            if (performance.now() >= (_millisecondsSinceTestStarted + _microsecondSetTimeoutMillisecondsToWait)) {
                _microsecondSetTimeoutCompletedCallback();
            } else {
                requestAnimationFrame(_timerLoop);
            }
        },
        _microsecondSetTimeout = function (completedCallback, millisecondsToWait) {
            _millisecondsSinceTestStarted = performance.now();
            _timerLoop();
        };
    var MicrosecondTimer = function (completedCallback, millisecondsToWait) {
        _microsecondSetTimeoutCompletedCallback = completedCallback;
        _microsecondSetTimeoutMillisecondsToWait = millisecondsToWait;
    };

    MicrosecondTimer.prototype.execute = function() {
        _microsecondSetTimeout(_microsecondSetTimeoutCompletedCallback, _microsecondSetTimeoutMillisecondsToWait);
    };

    return MicrosecondTimer;
});
