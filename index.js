'use strict'
const apiSeedsKey = 'bxnrdxpxDrum1aPjAmctaNH7r7iqfHpaemLTTBikyqzMhNsV8PSFNOVbfsySqNVI'
function startApp() {
    watchForm()

}
function getMusic(artist) {
    fetch(`https://orion.apiseeds.com/api/music/search/?q=${artist}&apikey=${apiSeedsKey}&limit=10`)
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderMusic(data)

        })


}

function getEvent(artist) {
    fetch(`https://www.eventbriteapi.com/v3/events/search/?q=${artist}`, {
        headers: {
            Authorization: `Bearer X5D2YDZ34BF4WC3AHP36`
        }
    })
        .then(response => response.json())
        .then(data => {
            console.log(data)
            renderEvent(data)

        })
}

function renderMusic(data) {
    $('#results-music').empty();
    $('#music').removeClass('hidden')
    for (let i = 0; i < data.result.length; i++) {
        $('#results-music').append(
            `<li>
<h3><img src="${data.result[i].cover}" target="_blank">${data.result[i].title}</h3>
    <p>${data.result[i].artist}</p>
    <p>${data.result[i].album}</p>
    </li>`)
    }
}

function renderEvent(data) {
    $('#results-event').empty();
    $('#event').removeClass('hidden')
    for (let i = 0; i < data.events.length; i++) {
        $('#results-event').append(
            `<li>
<h3><img src="${data.events[i].logo.url}" target="_blank">${data.events[i].name.text}</h3>
    <p>${data.events[i].summary}</p>
    <p>${data.events[i].album}</p>
    </li>`)
    }

}



function watchForm() {
    $('form').submit(event => {
        event.preventDefault();
        let artist = $('.artist-name').val();
        $('#results').addClass('hidden');
        getEvent(artist)
        getMusic(artist)


    });
}
$(startApp)