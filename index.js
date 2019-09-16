'use strict'
const openWeatherKey = '527be69af9e0687cce86953198b12581'
const mapsKey = 'AIzaSyDZO7BmldQ7TPGohXTa-PxNaoF81D7Ofuw'
function startApp() {
  watchForm()
  $('#result').hide();


}
function getWeather(location) {
  const toFetch = `https://api.openweathermap.org/data/2.5/weather?q=${location},US&APPID=${openWeatherKey}`
  fetch(toFetch)
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error(response.message);
    })
    .then(data => {
      displayWeather(data);
      $('#result').show();
      initMap(location);

    })
    .catch(err => {
      console.log(err)
      $('#js-error-message').text(`Hey the location was not found! Try Again!`);
      $('#result').hide();
    });

  console.log('getWeather loaded')

}

function displayWeather(data) {
  var convToF = Math.round(parseInt((`${data.main.temp}`) - 273.15)*(9/5)+32);
  $('#result-weather').empty();
  $('#js-error-message').empty();
  $('#result-weather').append(
    `<h3>${data.name}</h3>
    <li> Humidity: ${data.main.humidity} %</li>
    <li> Currently the day has  ${data.weather[0].description}</li>
    <li> The current temperature is: ${convToF} F</li>`

  );
  
  console.log(data);
  console.log('renderWeather loaded');
}


var map;
var service;
var infowindow;

function initMap(location) {
  var unitedStates = new google.maps.LatLng(37.0902, 95.7129);

  infowindow = new google.maps.InfoWindow();
console.log(document.getElementById('map-area'))
  map = new google.maps.Map(

    document.getElementById('map-area'), { center: unitedStates, zoom: 10 });

  var request = {
    query: location,
    fields: ['name', 'geometry','placeId'],
    type: 'park'
  };

  service = new google.maps.places.PlacesService(map);
  

  service.textSearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      for (var i = 0; i < results.length; i++) {
        createMarker(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }
    
  
  });

  
  console.log('initMap Loaded')
  

}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    console.log(place)
    let toolTipContent=''
    if (place.photos.length > 0){
      
        toolTipContent += `<img class='tooltip' src='${place.photos[0].getUrl()}'/>`   
    }
     toolTipContent += `Name: ${place.name}`
    infowindow.setContent(toolTipContent);
    infowindow.open(map, this);
  });
}





function watchForm() {
    $('form').submit(event => {
    event.preventDefault();
    let location = $('.location-name').val();
    
    getWeather(location);
    
    
    





  });
}
$(startApp)