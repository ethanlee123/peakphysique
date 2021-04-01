import { updateLocation } from "/scripts/api/firebase-queries.js"
// For reverse geocoding

// Instantiate a map and platform object:
// var platform = new H.service.Platform({
//     'apikey': 'lJDUiznQOwtD1zen7iUiTyeARTc79OTuhDsP_DkiECE'
//   });
  
// Get an instance of the search service:
// var service = platform.getGeocodingService();

// Call the reverse geocode method with the geocoding parameters,
// the callback and an error callback function (called if a
// communication error occurs):
export function reverseGeo(latitude, longitude) {
    var platform = new H.service.Platform({
        'apikey': 'apikey'
      });
    var service = platform.getGeocodingService();
    service.reverseGeocode({
    mode: "retrieveAddress",
    maxResults: 1,
    prox: latitude + "," + longitude,
    }, success => {
        let city = success.Response.View[0].Result[0].Location.Address.City;
        updateLocation(latitude, longitude, city);
    }, error => {
        console.log("error: ", error);
    });
};

// Asks user to allow/block locations
export function getLocation() {
    if (navigator.geolocation) {
        // First param is "successCallback", second is "blockedCallback"
        navigator.geolocation.getCurrentPosition(allowedLocation, blockedLocation);
    } else {
        console.log("Geolocation is not supported by this browser.");
    }
}

// Support: callback function for getLocation()
function allowedLocation(position) {
    reverseGeo(position.coords.latitude, position.coords.longitude);
    console.log("latitude: " + position.coords.latitude);
    console.log("longitude: " + position.coords.longitude);

    // console.log("called reverseGeo(): ", reverseGeo(position.coords.latitude, position.coords.longitude));
}

// Support: callback function for getLocation()
function blockedLocation(error) {
    if(error.code == 1) {
        alert("Allowing locations helps us show you people near you");
    } else if(error.code == 2) {
        alert("The network is down or the positioning service can't be reached.");
    } else if(error.code == 3) {
        alert("The attempt timed out before it could get the location data.");
    } else {
        alert("Geolocation failed due to unknown error.");
    }
}

