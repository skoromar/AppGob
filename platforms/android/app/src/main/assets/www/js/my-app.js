
// Initialize app
var app = new Framework7({
  panel: {
    swipe: 'left',
  }
});

// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;

let latitude = 0;
let longitude = 0;

// Add view
var mainView = app.addView('.view-main', {
    // Because we want to use dynamic navbar, we need to enable it for this view:
    dynamicNavbar: false
});

// Handle Cordova Device Ready Event
$$(document).on('deviceready', function() {
    console.log("Device is ready!");
});

// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="about"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    app.closePanel("left");
    app.alert('Here comes About');
})


$$(document).on('pageInit', '.page[data-page="faq"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    app.closePanel("left");
    
})

$$(document).on('pageInit', '.page[data-page="listen"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    app.closePanel("left");
   // debugger;
    $$('.form-to-data').on('click', function(){
      debugger;
      var formData = app.formToJSON('#my-form')
      alert(JSON.stringify(formData));
    }); 
})


/*
//prueba para enviar informacion 
$$.ajax({
type: "GET",
url: "http://localhost:3000/aux_map.html",
dataType: "jsonp",
data: {"hola": "hola"},
success:function(data)
{
  console.log("resp",data)

})

*/


$$(document).on('pageInit', '.page[data-page="map"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    //debugger;
    app.closePanel("left");
    navigator.geolocation.getCurrentPosition(function(position){
          
          var div = document.getElementById("map_canvas");
          plugin.google.maps.environment.setEnv({
            'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBe0T8526348cBO2vigGAsNqqCS-jwy8Ck',
            'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBe0T8526348cBO2vigGAsNqqCS-jwy8Ck'
          });
          var element = document.getElementById('geolocation');
          element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
                              'Longitude: '          + position.coords.longitude             + '<br />' ;
          latitude = position.coords.latitude; // Latitud
          longitude = position.coords.longitude; // Longitud
          var options = {
              camera: {
                target: {lat: latitude, lng: longitude},
                zoom: 18
              }
            };
          var map = plugin.google.maps.Map.getMap(div,options);
         
          var marker = map.addMarker({
            position: {lat: latitude, lng: longitude},
            title: "Posocion",
            snippet: "Aqui ando"
          })  
          
      }, onError);
    // Create a Google Maps native view under the map_canvas div.
    
      
})

$$(document).on('pageInit', '.page[data-page="calendar"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"

    app.alert('Here comes calendar');
    app.closePanel("left");
    
})


// onError Callback receives a PositionError object
//
function onError(error) {
    app.alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

