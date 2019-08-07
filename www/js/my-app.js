
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

})


$$(document).on('pageInit', '.page[data-page="faq"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    app.closePanel("left")
    
})


$$(document).on('pageInit', '.page[data-page="listen"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    app.closePanel("left")
    $$('.form-to-data').on('click', function(){
      var formData = app.formToJSON('#my-form')
      const options = {
        method: 'post',
        data: formData,
       // headers: :{"access-control-allow-origin":"*","etag":"W/\"389-eYsgCPOQs+tx5xhRGXeRM9ScPbY\"","x-powered-by":"Express","content-length":"905","content-type":"application/json; charset=utf-8"
      };
      //enable protocol comunication 
      cordova.plugin.http.sendRequest('http://192.168.108.63:8000/api/listen', options, function(response) {
        // prints 200
        var resp = JSON.parse(response.data);
        console.log("exito",)
        if(resp.status="success"){
          app.alert("Mensaje enviado con exito.");
        }else{
          app.alert("Ha ocurrido un error al enviar su mensaje, intente más tarde.");

        }
      }, function(response) {
        // prints 403
        alert("ERROOOR:  "+response.status+"---"+response.error);
      });
      // $.ajax({
      //       url: 'http://localhost:8000/api/listen',
      //       type: 'post',
      //       dataType: "jsonp",
      //       jsonp: "Callback",
      //       jsonpCallback: 'Callback',
      //       crossDomain: true,
      //       data: {'name':'name','email':'email'},
      //       contentType: "application/json"
      //     }).done(function(response){
      //       console.log('response',response)
      //     }).fail(function(error){
      //       console.log('error',error);
      //     });
    }); 
})





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

    app.closePanel("left");
})


// onError Callback receives a PositionError object
//
function onError(error) {
    app.alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}

