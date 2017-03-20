var getting = browser.storage.local.get("weather");
	getting.then(onWeatherGot, onError)		



function onWeatherGot(item) {
	console.log(item.weather)
	
	var weatherIcon = document.getElementById("weather-icon");
	
	weatherIcon.src = '/icons/' + item.weather.weather[0]['icon'] + '.png';
	weatherIcon.alt =  item.weather.weather[0]['description'];	
	weatherIcon.title =  item.weather.weather[0]['description'];

	var cityName = document.getElementById("city-name");
	
	cityName.textContent = item.weather['name'] + ", " + item.weather['sys']['country'];
	
	// TODO: implement settings checkbox to enable this feature
	//var synth = window.speechSynthesis;
	//var utterThis = new SpeechSynthesisUtterance('Current weather ' + item.weather.weather[0]['description']);	
	//synth.speak(utterThis);
	 
}


function onError(error) {
  console.log(`Error: ${error}`);
  console.log("Error happend");
}


