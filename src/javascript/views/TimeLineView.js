define(['text!templates/TimelineViewTemplate.html', 'jquery'], function(TimelineViewTemplate, $) {
    var _timelineModel,
        _parentElement,
        // no need for a templating engine here as we're just replacing two values
        _updateTemplate = function() {
            var updatedTemplate = TimelineViewTemplate.replace('%%TOP_PANE_TEXT%%', _getTopPaneText())
                .replace('%%BOTTOM_PANE_TEXT%%', _getBottomPaneText());

            // empty() removes event handlers
            _parentElement.empty();
            _parentElement.append(updatedTemplate);
            _wireBottomPaneClick();
        },
        _getBottomPaneText = function() {
            switch(_timelineModel.getPlayerState()) {
                case _timelineModel.NOT_STARTED: {
                    return 'play';
                }
                case _timelineModel.PLAYING: {
                    return 'pause';
                }
            }
        },
        _getTopPaneText = function() {
            switch(_timelineModel.getPlayerState()) {
                case _timelineModel.PLAYING: {
                    return 'at age ' + _timelineModel.getAgeForCurrentEvent() + ', ' + _timelineModel.getFirstName() + ' ' +
                        _timelineModel.getActivityForAge(_timelineModel.getAgeForCurrentEvent());
                }
                case _timelineModel.NOT_STARTED: {
                    return _timelineModel.getFullName();
                }
            }
        },
        _showclickedAnimation = function() {
            $('#timeline-bottom-pane').toggleClass('timeline-bottom-pane-unclicked');
            $('#timeline-bottom-pane').addClass('timeline-bottom-pane-clicked');

            setTimeout(function() {
                $('#timeline-bottom-pane').removeClass('timeline-bottom-pane-clicked');
                $('#timeline-bottom-pane').addClass('timeline-bottom-pane-unclicked');
            }, 100);
        },
        _wireBottomPaneClick = function() {
            $('#timeline-bottom-pane').click(function () {
                _timelineModel.changePlayerState();
                _showclickedAnimation();
                _controlTopPaneAnimation();
            });
        },
        _runTopPaneAnimation = function() {
            if(_timelineModel.PLAYING) {
                requestAnimationFrame(_runTopPaneAnimation);
            }

            var currentTime = performance.now() / 1000;
            var animationStartTime = _timelineModel.getCurrentEventAnimationStartTime() / 1000;
            var currentAnimationTime = _timelineModel.getPlaybackTimeForAge(_timelineModel.getAgeForCurrentEvent())

            if(currentTime - animationStartTime > currentAnimationTime) {
                _timelineModel.moveToNextEvent();
            }

            _updateTemplate();
        },
        _controlTopPaneAnimation = function() {
            if(_timelineModel.NOT_STARTED) {
                _runTopPaneAnimation();
            }
        },
        _handleModelEvents = function(eventData) {
            _updateTemplate();
        },
        TimelineView = function (parentElement, timelineModel) {
            _timelineModel = timelineModel;
            _parentElement = parentElement;
            _timelineModel.handleModelEvents(_handleModelEvents);
        };

    TimelineView.prototype.render = function() {
        _updateTemplate();
    }

    return TimelineView;
});
