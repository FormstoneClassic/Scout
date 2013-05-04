/*
 * Scout Plugin - Simple Google Analytics Events
 * @author Ben Plum
 * @version 0.0.6
 *
 * Copyright (c) 2013 Ben Plum <mr@benplum.com>
 * Released under the MIT License <http://www.opensource.org/licenses/mit-license.php>
 *
 */

if (jQuery) (function($) {
	
	// Default Options
	var options = {
		delay: 100,
		extensions: {} // extension options
	};
	
	// Initialize
	function _init(opts) {
		// Extend 
		$.extend(options, opts);
		
		// Attach Scout events 
		if (!$("body").data("scouting")) {
			$("body").data("scouting", true)
					 .on("click.scout", "[data-scout-event]", _track);
			
			for (var i in $.scout.extensions) {
				$.scout.extensions[i]( options.extensions[i] || null );
			}
		}
	}
	
	// Track events on click
	function _track(e) {
		e.preventDefault();
		
		var $target = $(this),
			url = $target.attr("href"),
			data = $target.data("scout-event").split(",");
		
		// Trim that data
		for (var i in data) {
			data[i] = $.trim(data[i]);
		}
		
		// Push data
		_push(data[0], data[1], (url || data[2]), data[3], data[4]);
		
		// If active link, launch that ish!
		if (url && !$target.data("scout-stop")) {
			// Delay based on Google's outbound link handler: 
			// http://support.google.com/analytics/bin/answer.py?hl=en&answer=1136920
			setTimeout(function() { 
				// Check window target
				if ($target.attr("target")) {
					window.open(url, $target.attr("target"));
				} else {
					document.location.href = url;
				}
			}, options.delay);
		}
	}
	
	// Push event to Google:
	// https://developers.google.com/analytics/devguides/collection/gajs/eventTrackerGuide
	function _push(category, action, label, value, noninteraction) {
		if (typeof _gaq == "undefined") {
			_gaq = [];
		}
		_gaq.push(['_trackEvent', category, action, label, value, noninteraction]);
	}
	
	// Define Plugin 
	$.scout = function() {
		if (arguments.length && typeof arguments[0] !== 'object') {
			_push.apply(this, arguments);
		} else {
			_init.apply(this, arguments);
		}
	};
	$.scout.extensions = {};
})(jQuery);