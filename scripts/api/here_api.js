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
function reverseGeo(latitude, longitude) {
    var platform = new H.service.Platform({
        'apikey': '{APIKEY}'
      });
    var service = platform.getGeocodingService();
    service.reverseGeocode({
    mode: "retrieveAddress",
    maxResults: 1,
    prox: 49.165107199999994 + "," + -122.8767232
    }, success => {
        console.log(success.Response.View[0].Result[0].Location.Address.City);
        // console.log(success.Response.View.values(Address));
        console.log(success.Response);
    }, error => {
        console.log("error: ", error);
    });
};

reverseGeo();

// city to geopoint