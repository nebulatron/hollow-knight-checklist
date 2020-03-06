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