'use strict';

define(['text!components/timeline/TimelineViewTemplate.html', 'shared/MicrosecondTimer',
    'components/timeline/TimelinePlayerState', 'jquery'], function(TimelineViewTemplate, MicrosecondTimer,
        TimelinePlayerState, $) {
    var _timelinePlayerState,
        _timelinePlayer,
        _timelineData,
        _parentElement,
        _templatedRendered = false,
        _loadedEventHandler,
        // no need for a templating engine here as we're just replacing two values
        _updateTemplate = function() {
            if(_templatedRendered) {
                $('#timeline-top-pane-text').text(_getTopPaneText());
                $('#timeline-bottom-pane-text').text(_getBottomPaneText());
            } else {
                var updatedTemplate = TimelineViewTemplate.replace('%%TOP_PANE_TEXT%%', _getTopPaneText())
                    .replace('%%BOTTOM_PANE_TEXT%%', _getBottomPaneText());

                _parentElement.append(updatedTemplate);
                _wireBottomPaneClick();
                _templatedRendered = true;

                if(_loadedEventHandler) {
                    _loadedEventHandler();
                }
            }
        },
        _getBottomPaneText = function() {
            switch(_timelinePlayerState.getPlayerState()) {
                case TimelinePlayerState.prototype.NOT_STARTED:
                case TimelinePlayerState.prototype.PAUSED: {
                    return 'play';
                }
                case TimelinePlayerState.prototype.PLAYING: {
                    return 'pause';
                }
                case TimelinePlayerState.prototype.COMPLETED: {
                    return 'restart';
                }
            }
        },
        _getTopPaneText = function() {
            switch(_timelinePlayerState.getPlayerState()) {
                case TimelinePlayerState.prototype.PLAYING:
                case TimelinePlayerState.prototype.COMPLETED:
                case TimelinePlayerState.prototype.PAUSED: {
                    return 'at age ' + _timelinePlayerState.currentEventAge + ', ' + _timelineData.firstName + ' ' +
                        _timelinePlayerState.currentActivity;
                }
                case TimelinePlayerState.prototype.NOT_STARTED: {
                    return _timelineData.fullName;
                }
            }
        },
        _showclickedAnimation = function() {
            $('#timeline-bottom-pane').toggleClass('timeline-bottom-pane-unclicked');
            $('#timeline-bottom-pane').addClass('timeline-bottom-pane-clicked');

            new MicrosecondTimer(function() {
                $('#timeline-bottom-pane').removeClass('timeline-bottom-pane-clicked');
                $('#timeline-bottom-pane').addClass('timeline-bottom-pane-unclicked');
            }, 100).execute();
        },
        _wireBottomPaneClick = function() {
            $('#timeline-bottom-pane').click(function () {
                _timelinePlayer.togglePlayingPaused();
                // having some issues using multiple requestanimationframe's currently.  debug later.
                //_showclickedAnimation();
            });
        },
        _handleModelEvents = function(eventData) {
            _updateTemplate();
        },
        TimelineView = function (parentElement, timelinePlayerState, loadedEventHandler, timelineData, timelinePlayer) {
            _timelinePlayerState = timelinePlayerState;
            _parentElement = parentElement;
            _timelinePlayerState.setStateChangedEventHandler(_handleModelEvents);
            _loadedEventHandler = loadedEventHandler;
            _timelineData = timelineData;
            _timelinePlayer = timelinePlayer;
        };

    TimelineView.prototype.render = function() {
        _updateTemplate();
    };

    TimelineView.prototype.destroy = function() {
        _parentElement.empty();
        _templatedRendered = false;
    };

    return TimelineView;
});
