'use strict'
// API Keys to be able to GET Info from their endpoint
const openWeatherKey = '527be69af9e0687cce86953198b12581'
const mapsKey = 'AIzaSyDZO7BmldQ7TPGohXTa-PxNaoF81D7Ofuw'

//This function initializes the APP
function startApp() {
  watchForm()
  $('#result').hide();
  $('.sticky').hide();
  $('.sticky-bot').hide();


}

//This function will fetch infromation from OpenWeather API and provide local weather information
// of the area that the user search. If there is a problem or there is a typo introduced on the 
//search bar the APP will prompt the user to search again.
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
      $('.sticky').show();
      $('.sticky-bot').show();
      initMap(location);

    })
    .catch(err => {
      
      $('#js-error-message').text(`Hey the location was not found! Try Again!`);
      $('#result').hide();
    });

  

}


// This function displays the desired information from the request made to the OpenWeather API
//It will also Append the information into the DOM
function displayWeather(data) {
  var convToF = Math.round(parseInt((`${data.main.temp}`) - 273.15) * (9 / 5) + 32);
  $('#result-weather').empty();
  $('#js-error-message').empty();
  $('#result-weather').append(
    `<h3>${data.name}</h3>
    <li> Humidity: ${data.main.humidity} %</li>
    <li> Currently the day has  ${data.weather[0].description}</li>
    <li> The current temperature is: ${convToF} F</li>`

  );

  
}

// This section below is to render the map in addition the request made
//to google maps API will return the specified type of location as 
// specified by request = type: 'park' 
var map;
var service;
var infowindow;

function initMap(location) {
  var unitedStates = new google.maps.LatLng(37.0902, 95.7129);

  infowindow = new google.maps.InfoWindow();
  
  map = new google.maps.Map(

    document.getElementById('map-area'), { center: unitedStates, zoom: 13 });

  var request = {
    query: location,
    fields: ['name', 'geometry', 'placeId'],
    type: 'park',

  };

  service = new google.maps.places.PlacesService(map);


  service.textSearch(request, function (results, status) {
    if (status === google.maps.places.PlacesServiceStatus.OK) {
      $('.places-result').empty();
      $('#js-error-message').empty();
      for (var i = 0; i < 10; i++) {
        createMarker(results[i]);
        placesResult(results[i]);
      }

      map.setCenter(results[0].geometry.location);
    }


  });


  


}
function placesResult(place) {
  let content = '';
  if (place.photos && place.photos.length > 0) {
    content += `<img class='tooltip' src='${place.photos[0].getUrl()}'/>`
  }
  $('.places-result').append(
    `<li id="${place.id}"><h3>${place.name}</h3> <p>${place.formatted_address}</p>
    <p>${place.rating} out of 5 with a total of ${place.user_ratings_total} reviews</p> ${content}</li>`)
}


function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function () {
    
    let toolTipContent = ''
    if (place.photos && place.photos.length > 0) {

      toolTipContent += `<a href="#${place.id}"}>Name: ${place.name}</a>`
    }
    

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