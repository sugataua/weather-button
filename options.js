function saveOptions(e) {
  e.preventDefault();
  
  var selected_units = document.querySelector('input[name="units"]:checked').value;
  var city_name = document.querySelector('#city_name').value;
  var update_period = document.getElementById("update_period").value;
  
  var settings = {};

  settings.units = selected_units;
  settings.city_name = city_name;
  settings.update_period = update_period;

  
	function onError(error) {
		console.log(`Error: ${error}`);
	}
  
  setting = browser.storage.local.set({settings});
  setting.then(null, onError);
  
  browser.runtime.sendMessage({settings});
}

function restoreOptions() {

  function setCurrentChoice(result) {  
	
	if(result.settings) {
		document.settingForm.units.value = result.settings.units;
		document.settingForm.city_name.value = result.settings.city_name;
		document.settingForm.update_period.value = result.settings.update_period;
	} else {
		document.settingForm.units.value = "metric";
		document.settingForm.city_name.value = "Kiev";
		document.settingForm.update_period.value = "60";
	}
	
  }

  function onError(error) {
    console.log(`Error: ${error}`);
  }

  var getting = browser.storage.local.get("settings");  
  getting.then(setCurrentChoice, onError);
}

document.addEventListener("DOMContentLoaded", restoreOptions);
document.querySelector("form").addEventListener("submit", saveOptions);
