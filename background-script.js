// Setting alarm to refresh weather conditions every few hours
const WEATHER_ALARM_NAME = "weather-update-alarm"; 

function setUpdateAlarm(settings) {
	var refreshPeriod = parseInt(settings.update_period);
	
	if (isNaN(refreshPeriod)) {
		console.log("Error! Update_period is not a number!");
		refreshPeriod = 60;
	}
	browser.alarms.create(WEATHER_ALARM_NAME, {  
	periodInMinutes: refreshPeriod
	});	
	
	return settings;
}

function handleAlarm(alarm) {    
	if (alarm.name === WEATHER_ALARM_NAME) {
		console.log("Alarm fired!");
		onSettingsUpdate();		
	}
}

browser.alarms.onAlarm.addListener(handleAlarm);
// ==============================================
// Getting settings
function onError(error) {
  console.log('Error: ${error}');
  console.log("Error happend");
}

function onSettingsGot(item) {
  var settings = {}
  
  if (item.settings) {
	settings = item.settings;
	console.log("Units:" + item.settings["units"]); 
	console.log("Units:" + item.settings.units); 
  } else {
	settings["city_name"] = "Kiev";
	settings["units"] = "metric";	  
	settings["update_period"] = "60";
  }
 
  
  return settings;  
}
// ==============================================
// Getting weather data from web and update button badge and title
function refreshWeatherData(params) {
	
	var xhr = new XMLHttpRequest();

	xhr.open('GET', 'http://api.openweathermap.org/data/2.5/weather?q=' +
	params["city_name"] + '&units=' + params["units"] +'&APPID=de23c150a1644cb195e5072ee217bc2d', true);

	xhr.onreadystatechange = function() {
		if (this.readyState == 4) {
			if (this.status != 200) {
				//handling error
				browser.browserAction.setBadgeText({text: "N/A"});
				browser.browserAction.setTitle({title: "Connection problem"});
				return;
			}

			// Success in getting weather data
			var resp = JSON.parse(xhr.responseText);

			var current_temp = Math.round(resp['main']['temp']);
			var city_name = resp['name'];
			var country_code = resp['sys']['country'];
			var icon_name = resp.weather[0]['icon'];

			browser.browserAction.setBadgeText({text: current_temp.toString() + "°"});
			browser.browserAction.setTitle({title: city_name + ", " + country_code});
			browser.browserAction.setIcon({path: "icons/" + icon_name +".png"});
			
			var data_setting = browser.storage.local.set({weather: resp});
			console.log("Trying to save resp in storage!");
			data_setting.then(null, onError);
		}
	};
	xhr.send();	
	
}
// =======================================================
//
function onSettingsUpdate () {	
var getting = browser.storage.local.get("settings");
	getting.then(onSettingsGot, onError)
		.then(setUpdateAlarm)
		.then(refreshWeatherData)		
}
// =======================================================
// Receiving notifications from options about settings updates
function notify(message) {
/*
  browser.notifications.create({
    "type": "basic",
    "iconUrl": browser.extension.getURL("link.png"),
    "title": "Weather Location is changed!",
    "message": "New city - " + message.settings.city_name
  });
  */
     
	onSettingsUpdate();	
}

browser.runtime.onMessage.addListener(notify);

// =====================================================
// Initial weather update with default params
onSettingsUpdate();