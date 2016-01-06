angular.module('angularFinalCountDown', ['ng'])
.directive('FinalCountdown', [function() {
	return {
		restrict: 'E',
		scope: {
			config: '='
		},
		link: function(scope, element, attrs) {
			var layers = [];
			var prepareCountersFuncs = [_prepareSecondsCounter, _prepareMinuteCounter,
		    _prepareHourCounter, _prepareDayCounter];
	        var defaults = {
	            countdown_from: 10,
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
	                borderColor: '#ECEFCB',
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
			DAY = 24 * 3600;
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
				html += '<div class="clock-item ' + settings.faces[i]._class + ' countdown-time-value col-sm-6 col-md-3">' +
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

	        if (typeof callback == 'function') { // make sure the callback is a function
	            callbackFunction = callback;
	        }

	        responsive();
	        dispatchTimer();
	        prepareCounters();
	        startCounters();

		    function responsive() {
		        angular.element(window).load(updateCircles);

		        angular.element(window).on('redraw', function() {
		            switched = false;
		            updateCircles();
		        });
		        angular.element(window).on('resize', updateCircles);
		    }

		    function updateCircles() {
		        for (var i = 0; i < watches; ++i) {
		        	layers[i].draw();
		        }
		    }

		    function convertToDeg(degree) {
		        return (Math.PI/180)*degree - (Math.PI/180)*90
		    }

		    function dispatchTimer() {
		        timer = {
		            total: Math.floor((settings.countdown_from) / 86400),
		            days: Math.floor((settings.countdown_from) / 86400),
		            hours: 24 - Math.floor(((settings.countdown_from) % 86400) / 3600),
		            minutes: 60 - Math.floor((((settings.countdown_from) % 86400) % 3600) / 60),
		            seconds: 60 - Math.floor((((settings.countdown_from) % 86400) % 3600) % 60 )
		        }

		        console.log(timer);
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
		                console.log(seconds_width, radius);
		                var x = seconds_width / 2;
		                var y = seconds_width / 2;

		                context.beginPath();
		                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.seconds * 6));
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_seconds).html(60 - timer.seconds);
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
		                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.minutes * 6));
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_minutes).html(60 - timer.minutes);

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
		                context.arc(x, y, radius, convertToDeg(0), convertToDeg(timer.hours * 360 / 24));
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_hours).html(24 - timer.hours);

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
		                if (timer.total == 0) {
		                    context.arc(x, y, radius, convertToDeg(0), convertToDeg(360));
		                } else {
		                    context.arc(x, y, radius, convertToDeg(0), convertToDeg((360 / timer.total) * (timer.total - timer.days)));
		                }
		                context.fillStrokeShape(this);

		                angular.element(settings.selectors.value_days).html(timer.days);

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

		    function startCounters() {
		        var interval = setInterval( function() {
		            if (timer.seconds > 59 ) {
		                if (60 - timer.minutes == 0 && 24 - timer.hours == 0 && timer.days == 0) {
		                    clearInterval(interval);
		                    if (callbackFunction !== undefined) {
		                        callbackFunction.call(this); // brings the scope to the callback
		                    }
		                    return;
		                }

		                timer.seconds = 1;

		                if (timer.minutes > 59) {
		                    timer.minutes = 1;

		                    if (watches.length > 1) {
			                	layers[1].draw();
			                }

		                    if (timer.hours > 23) {
		                        timer.hours = 1;
		                        if (timer.days > 0) {
		                            timer.days--;

		                            if (watches.length > 3) {
					                	layers[3].draw();
					                }
		                        }
		                    } else {
		                        timer.hours++;
		                    }

		                    if (watches.length > 2) {
			                	layers[2].draw();
			                }
		                } else {
		                    timer.minutes++;
		                }

		                if (watches.length > 1) {
		                	layers[1].draw();
		                }
		            } else {
		                timer.seconds++;
		            }

		            layers[0].draw();
		        }, 1000);
		    }
		}
	}
}]);