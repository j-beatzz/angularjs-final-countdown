AngularJS Final Countdown
======================
This was formally written by Pragmatic Mates - a big shout out to them.
I just made it into a simple angularjs directive.

(Still a work in progress)

Check out the original demo by pragmatic mates:

- http://final-countdown.pragmaticmates.com/demo/index.html
- http://final-countdown.pragmaticmates.com/demo/data-attributes.html

Requirements
------------
- jQuery http://jquery.com
- Kinetic http://kineticjs.com
- AngularJS https://angularjs.org/

JS Code
---------------
::

	$scope.config = {
		countdown_from: 10 // 10 - 9 - 8 - 7 - ...
	};

HTML Template
-------------
::
	<final-countdown config="config"></final-countdown>

Default Settings
----------------
::

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

Data Attributes
----------------
Data attributes cannot be used for now unfortunately.