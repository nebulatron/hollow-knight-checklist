/*!
 * JavaScript Cookie v2.2.1
 * https://github.com/js-cookie/js-cookie
 *
 * Copyright 2006, 2015 Klaus Hartl & Fagner Brack
 * Released under the MIT license
 */
;(function (factory) {
	var registeredInModuleLoader;
	if (typeof define === 'function' && define.amd) {
		define(factory);
		registeredInModuleLoader = true;
	}
	if (typeof exports === 'object') {
		module.exports = factory();
		registeredInModuleLoader = true;
	}
	if (!registeredInModuleLoader) {
		var OldCookies = window.Cookies;
		var api = window.Cookies = factory();
		api.noConflict = function () {
			window.Cookies = OldCookies;
			return api;
		};
	}
}(function () {
	function extend () {
		var i = 0;
		var result = {};
		for (; i < arguments.length; i++) {
			var attributes = arguments[ i ];
			for (var key in attributes) {
				result[key] = attributes[key];
			}
		}
		return result;
	}

	function decode (s) {
		return s.replace(/(%[0-9A-Z]{2})+/g, decodeURIComponent);
	}

	function init (converter) {
		function api() {}

		function set (key, value, attributes) {
			if (typeof document === 'undefined') {
				return;
			}

			attributes = extend({
				path: '/'
			}, api.defaults, attributes);

			if (typeof attributes.expires === 'number') {
				attributes.expires = new Date(new Date() * 1 + attributes.expires * 864e+5);
			}

			// We're using "expires" because "max-age" is not supported by IE
			attributes.expires = attributes.expires ? attributes.expires.toUTCString() : '';

			try {
				var result = JSON.stringify(value);
				if (/^[\{\[]/.test(result)) {
					value = result;
				}
			} catch (e) {}

			value = converter.write ?
				converter.write(value, key) :
				encodeURIComponent(String(value))
					.replace(/%(23|24|26|2B|3A|3C|3E|3D|2F|3F|40|5B|5D|5E|60|7B|7D|7C)/g, decodeURIComponent);

			key = encodeURIComponent(String(key))
				.replace(/%(23|24|26|2B|5E|60|7C)/g, decodeURIComponent)
				.replace(/[\(\)]/g, escape);

			var stringifiedAttributes = '';
			for (var attributeName in attributes) {
				if (!attributes[attributeName]) {
					continue;
				}
				stringifiedAttributes += '; ' + attributeName;
				if (attributes[attributeName] === true) {
					continue;
				}

				// Considers RFC 6265 section 5.2:
				// ...
				// 3.  If the remaining unparsed-attributes contains a %x3B (";")
				//     character:
				// Consume the characters of the unparsed-attributes up to,
				// not including, the first %x3B (";") character.
				// ...
				stringifiedAttributes += '=' + attributes[attributeName].split(';')[0];
			}

			return (document.cookie = key + '=' + value + stringifiedAttributes);
		}

		function get (key, json) {
			if (typeof document === 'undefined') {
				return;
			}

			var jar = {};
			// To prevent the for loop in the first place assign an empty array
			// in case there are no cookies at all.
			var cookies = document.cookie ? document.cookie.split('; ') : [];
			var i = 0;

			for (; i < cookies.length; i++) {
				var parts = cookies[i].split('=');
				var cookie = parts.slice(1).join('=');

				if (!json && cookie.charAt(0) === '"') {
					cookie = cookie.slice(1, -1);
				}

				try {
					var name = decode(parts[0]);
					cookie = (converter.read || converter)(cookie, name) ||
						decode(cookie);

					if (json) {
						try {
							cookie = JSON.parse(cookie);
						} catch (e) {}
					}

					jar[name] = cookie;

					if (key === name) {
						break;
					}
				} catch (e) {}
			}

			return key ? jar[key] : jar;
		}

		api.set = set;
		api.get = function (key) {
			return get(key, false /* read as raw */);
		};
		api.getJSON = function (key) {
			return get(key, true /* read as json */);
		};
		api.remove = function (key, attributes) {
			set(key, '', extend(attributes, {
				expires: -1
			}));
		};

		api.defaults = {};

		api.withConverter = init;

		return api;
	}

	return init(function () {});
}));

var checkboxes;

function init() {
	checkboxes = document.querySelectorAll("input[type='checkbox']");
	reloadProgress();
	countProgress();
	listenForProgress();
	updatePercentage();
	initCookieAlert();
	document.getElementsByTagName('body')[0].className = "js";
}

function reloadProgress() {
	var progress = Cookies.get('progress');

	if(progress && progress.length){
		progress = JSON.parse(progress);

		for(var id in progress) {
			if(progress[id] == 1) {
				var el = document.querySelector("input[data-key='" + id + "']");
				
				el.checked = true;
			}
		}
	}
}

function listenForProgress() {
	for (var i = checkboxes.length - 1; i >= 0; i--) {
		checkboxes[i].addEventListener('change', function(event) {
			var id = event.target.getAttribute('id');
			saveProgress();
			countProgress();
			updatePercentage();
		});
	}

	document.getElementById("uncheckAll").addEventListener('click', function(event) {
		event.preventDefault();

		for (var i = checkboxes.length - 1; i >= 0; i--) {
			checkboxes[i].checked = false;
		}

		saveProgress();
		countProgress();
		updatePercentage();
	});
}

function saveProgress() {
	var progress = {};

	for (var i = checkboxes.length - 1; i >= 0; i--) {
		var checked = checkboxes[i].checked;
		var id = checkboxes[i].getAttribute('data-key');

		if(checked == true) {
			checked = 1;
		} else {
			checked = 0;
		}

		progress[id] = checked;
	}

	Cookies.set('progress', progress);
}

function countProgress() {
	var a = checkboxes.length;

	for (var i = checkboxes.length - 1; i >= 0; i--) {
		var checked = checkboxes[i].checked;
		var id = checkboxes[i].getAttribute('data-key');

		if(checked == true) {
			a -= 1;
		}

		document.getElementById("amountRemaining").innerHTML = a;
	}

	if(a == 0) {
		document.getElementById("congrats").style["display"] = "inline"; 
	} else {
		document.getElementById("congrats").style["display"] = ""; 
	}

	if(a < checkboxes.length) {
		document.getElementById("uncheckAll").style["display"] = "inline"; 
	} else {
		document.getElementById("uncheckAll").style["display"] = ""; 
	}
}

function initCookieAlert() {
	var hiddenCookieAlert = Cookies.get('hideCookieAlert');

	if(! hiddenCookieAlert) {
		document.getElementById("hideCookieAlert").addEventListener('click', function(event) {
			event.preventDefault();
			Cookies.set('hideCookieAlert', true);
			document.getElementById("cookieAlert").style['display'] = 'none';
		});
	} else {
		document.getElementById("cookieAlert").style['display'] = 'none';
	}
}

function updatePercentage() {
	var percent = 0;
	for (var i = checkboxes.length - 1; i >= 0; i--) {
		if(checkboxes[i].checked) {
			percent += (checkboxes[i].getAttribute('data-percent') * 1);
		}
	}

	percent = (Math.round(percent * 100) / 100);
	percentElement = document.getElementById("percent");

	percentElement.innerHTML = percent + '% <small>done</small>';
	if(percent == 112) {
		percentElement.className = "complete";
	} else {
		percentElement.className = "";
	}
}

window.onload = init();