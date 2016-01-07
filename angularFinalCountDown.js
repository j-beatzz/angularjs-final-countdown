/*
	The original code from Pragmatic mates has been extensively modified
	to so as to make it compaitble with angularjs.

	Authors:
		Pragmatic Mates
	Contributor:
		Joshua LEO-Irabor
*/

angular.module('angularFinalCountDown', ['ng'])
.directive('FinalCountdown', [function() {
	return {
		restrict: 'E',
		scope: {
			config: '='
		},
		link: function(scope, element, attrs) {
		    var interval;
			var layers = [];
			var color_state = -1;
			var prepareCountersFuncs = [_prepareSecondsCounter, _prepareMinuteCounter,
		    _prepareHourCounter, _prepareDayCounter];

		    var timer = [];

		    var colors = {
		    	RED: 'rgba(216, 56, 56, .64)',
		    	BLUE: 'rgba(168, 161, 210, .53)',
		    	GREEN: 'rgba(181, 218, 164, .53)',
		    	ORANGE: 'rgba(218, 193, 164, .64)'
		    }

		    var offset = 0;
		    var last_watch = 0;

	        var defaults = {
	            countdown_from: 10,
	            animate_colors: true,
	            events: {
	            	start_event: 'start-count-down',
	            	stop_event: 'stop-count-down'
	            },
	            faces: [{
	            	display: 'S',
	            	id: 'canvas-seconds',
	            	_class: 'clock-seconds'
	            }, {
	            	display: 'M',
	            	id: 'canvas-minutes',
	            	_class: 'clock-minutes'
	            }, {
	            	display: 'H',
	            	id: 'canvas-hours',
	            	_class: 'clock-hours'
	            }, {
	            	display: 'D',
	            	id: 'canvas-days',
	            	_class: 'clock-days'
	        	}],
	            selectors: {
	                value_seconds: '.clock-seconds .val',
	                canvas_seconds: 'canvas-seconds',
	                value_minutes: '.clock-minutes .val',
	                canvas_minutes: 'canvas-minutes',
	                value_hours: '.clock-hours .val',
	                canvas_hours: 'canvas-hours',
	                value_days: '.clock-days .val',
	                canvas_days: 'canvas-days'
	            },
	            seconds: {
	                borderColor: '#7995D5',
	                borderWidth: '6'
	            },
	            minutes: {
	                borderColor: '#ACC742',
	                borderWidth: '6'
	            },
	            hours: {
	                borderColor: '#FF00D7',
	                borderWidth: '6'
	            },
	            days: {
	                borderColor: '#FF9900',
	                borderWidth: '6'
	            }
	        };

	        var settings = angular.extend({}, defaults/*, scope.config*/);

	        var html = "";
			var watches = 1;
			DAY = 86400;
			HOUR = 3600;
			MINUTE = 60;

			if (settings.countdown_from > DAY) {
				watches = 4;
			} else if (DAY > settings.countdown_from && settings.countdown_from > HOUR) {
				watches = 3;
			} else if (HOUR > settings.countdown_from && settings.countdown_from > MINUTE) {
				watches = 2;
			}

			var col_size = watches * 3;

			html = '<div class="countdown countdown-container">' +
					    '<div class="row">';
			for(var i = watches - 1; i >= 0; --i) {
				html += '<div class="clock-item ' + settings.faces[i]._class +
						' countdown-time-value col-sm-6 col-md-3">' +
			            '<div class="wrap">' +
		                '<div class="inner">' +
	                    '<div id="' + settings.faces[i].id + '" class="clock-canvas"></div>' +
	                    '<div class="text">' +
                        '<p class="val">0</p>' +
                        '<p class="type-days type-time">' + settings.faces[i].display+ '</p>' +
	                    '</div>' +
		                '</div>' +
			            '</div>' +
				        '</div>';
			}

			html += '</div></div>';

			element.html(html);

	        if (settings.now < settings.start) {
	            settings.start = settings.now;
	            settings.end = settings.now;
	        }

	        if (settings.now > settings.end) {
	            settings.start = settings.now;
	            settings.end = settings.now;
	        }

	        responsive();
	        dispatchTimer();
	        prepareCounters();

	        scope.$on(settings.events.start_event, function() {
	        	startCounters();
	        });

	        scope.$on(settings.events.stop_event, function() {
	        	stopCounters();
	        });

		    function responsive() {
		        angular.element(window).load(updateCircles);

		        angular.element(window).on('redraw', function() {
		            switched = false;
		            updateCircles();
		        });
		        angular.element(window).on('resize', updateCircles);
		    }

		    function setNextColor(state) {
		    	if (state == color_state) return;
	    		var color = "";
	    		switch (state) {
	    			case 1:
	    				color = colors.BLUE;
	    				break;
	    			case 2:
	    				color = colors.GREEN;
	    				break;
	    			case 3:
	    				color = colors.ORAGE;
	    				break;
    				case 4:
	    				color = colors.RED;
	    				break;
					default:
						break;
				}
				angular.element('.clock-canvas').css('background-color', color);
				color_state = state;
		    }

		    function updateCircles() {
		        for (var i = 0; i < watches; ++i) {
		        	layers[i].draw();
		        }
		    }

		    function convertToRad(degree) {
		        return (Math.PI/180)*degree - (Math.PI/180)*90
		    }

		    function dispatchTimer() {
	            // seconds
	            timer.push(Math.floor((((settings.countdown_from) % DAY) % HOUR) % MINUTE ));

	            // minutes
	            if (watches > 1) {
	            	timer.push(Math.floor((((settings.countdown_from) % DAY) % HOUR) / MINUTE));
	            }

	            // hours
	            if (watches > 2) {
	            	timer.push(Math.floor(((settings.countdown_from) % DAY) / HOUR));
	            }

	            // days
	            if (watches > 3) {
	            	timer.push(Math.floor((settings.countdown_from) / DAY));
	            }

	            offset = 360 / timer[watches - 1];

		    }

		    function _prepareSecondsCounter() {
		    	// Seconds
		        var seconds_width = angular.element('#' + settings.selectors.canvas_seconds).width()
		        var secondsStage = new Kinetic.Stage({
		            container: settings.selectors.canvas_seconds,
		            width: seconds_width,
		            height: seconds_width
		        });

		        var circleSeconds = new Kinetic.Shape({
		            drawFunc: function(context) {
		                var seconds_width = angular.element('#' + settings.selectors.canvas_seconds).width()
		                var radius = seconds_width / 2 - settings.seconds.borderWidth / 2;
		                var x = seconds_width / 2;
		                var y = seconds_width / 2;

		                context.beginPath();

		                if (watches == 1) {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[0] * offset));
		                } else {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[0] * 6));
		                }
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_seconds).html(timer[0]);
		            },
		            stroke: settings.seconds.borderColor,
		            strokeWidth: settings.seconds.borderWidth
		        });

		        var layerSeconds = new Kinetic.Layer();
		        layerSeconds.add(circleSeconds);
		        secondsStage.add(layerSeconds);
		        layers.push(layerSeconds);
		    }

		    function _prepareMinuteCounter() {
		    	// Minutes
		        var minutes_width = angular.element('#' + settings.selectors.canvas_minutes).width();
		        var minutesStage = new Kinetic.Stage({
		            container: settings.selectors.canvas_minutes,
		            width: minutes_width,
		            height: minutes_width
		        });

		        var circleMinutes = new Kinetic.Shape({
		            drawFunc: function(context) {
		                var minutes_width = angular.element('#' + settings.selectors.canvas_minutes).width();
		                var radius = minutes_width / 2 - settings.minutes.borderWidth / 2;
		                var x = minutes_width / 2;
		                var y = minutes_width / 2;

		                context.beginPath();
		                if (watches == 2) {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[1] * offset));
		                } else {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[1] * 6));
		                }
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_minutes).html(timer[1]);

		            },
		            stroke: settings.minutes.borderColor,
		            strokeWidth: settings.minutes.borderWidth
		        });

		        var layerMinutes = new Kinetic.Layer();
		        layerMinutes.add(circleMinutes);
		        minutesStage.add(layerMinutes);
		        layers.push(layerMinutes);
		    }

		    function _prepareHourCounter() {
		    	// Hours
		        var hours_width = angular.element('#' + settings.selectors.canvas_hours).width();
		        var hoursStage = new Kinetic.Stage({
		            container: settings.selectors.canvas_hours,
		            width: hours_width,
		            height: hours_width
		        });

		        var circleHours = new Kinetic.Shape({
		            drawFunc: function(context) {
		                var hours_width = angular.element('#' + settings.selectors.canvas_hours).width();
		                var radius = hours_width / 2 - settings.hours.borderWidth/2;
		                var x = hours_width / 2;
		                var y = hours_width / 2;

		                context.beginPath();
		                if (watches == 3) {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[2] * offset));
		                } else {
		                	context.arc(x, y, radius, convertToRad(0), convertToRad(timer[2] * 360 / 24));
		                }
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_hours).html(timer[2]);

		            },
		            stroke: settings.hours.borderColor,
		            strokeWidth: settings.hours.borderWidth
		        });

		        var layerHours = new Kinetic.Layer();
		        layerHours.add(circleHours);
		        hoursStage.add(layerHours);
		        layers.push(layerHours);
		    }

		    function _prepareDayCounter() {
		    	// Days
		        var days_width = angular.element('#' + settings.selectors.canvas_days).width();
		        var daysStage = new Kinetic.Stage({
		            container: settings.selectors.canvas_days,
		            width: days_width,
		            height: days_width
		        });

		        var circleDays = new Kinetic.Shape({
		            drawFunc: function(context) {
		                var days_width = angular.element('#' + settings.selectors.canvas_days).width();
		                var radius = days_width/2 - settings.days.borderWidth/2;
		                var x = days_width / 2;
		                var y = days_width / 2;


		                context.beginPath();
		                // Since Days will always be the highest time representation. We can assume that
		                // offset will always be for the Day watch
		                context.arc(x, y, radius, convertToRad(0), convertToRad(offset * timer[3]));
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_days).html(timer[3]);

		            },
		            stroke: settings.days.borderColor,
		            strokeWidth: settings.days.borderWidth
		        });

		        var layerDays = new Kinetic.Layer();
		        layerDays.add(circleDays);
		        daysStage.add(layerDays);
		        layers.push(layerDays);
		    }

		    function prepareCounters() {
		    	for(var i = 0; i < watches; ++i) {
		    		prepareCountersFuncs[i]();
		    	}
		    }

		    function timerFinished() {
		    	return timer[0] == 0 && (timer[1] == 0 || timer[1] == undefined)
		    						 && (timer[2] == 0 || timer[2] == undefined)
		    						 && (timer[3] == 0 || timer[3] == undefined);
		    }

		    function startCounters() {
		        interval = setInterval( function() {
		            if (timer[0] < 1) {
		                if (timerFinished()) {
		                    clearInterval(interval);
		                    return;
		                }

		                timer[0] = 59;

		                if (timer[1] < 1) {
		                    timer[1] = 59;

		                    if (timer[2] < 1) {
		                        timer[2] = 24;
		                        if (timer[3] > 0) {
		                            timer[3]--;

		                            if (watches > 3) {
					                	layers[3].draw();
					                }
		                        }
		                    } else {
		                        timer[2]--;
		                    }

		                    if (watches > 2) {
			                	layers[2].draw();
			                }
		                } else {
		                    timer[1]--;
		                }

		                if (watches > 1) {
		                	layers[1].draw();
		                }
		            } else {
		                timer[0]--;

		                if (timer[0] > 45) {
		                	setNextColor(1);
		                } else if (45 >= timer[0] && timer[0] > 30) {
		                	setNextColor(2);
		                } else if (30 >= timer[0] && timer[0] > 15) {
		                	setNextColor(3);
		                } else {
		                	setNextColor(4);
		                }
		            }

		            layers[0].draw();
		        }, 1000);
		    }

		    function stopCounters() {
		    	if (interval) {
		    		clearInterval(interval);
		    	}
		    }
		}
	}
}]);