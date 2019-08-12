
// Initialize app
var app = new Framework7({
  panel: {
    swipe: 'left',
  }
});

var env = "production";//production -sandbox
var conf = {
    sandbox:{
      url:"localhost"
    },
    production:{
      url:"192.168.0.8"
    }

}[env]
// If we need to use custom DOM library, let's save it to $$ variable:
var $$ = Dom7;


$$('.url-redirect').on('click', function (e) {
  console.log('clicked', $$(this).attr("href"));
  window.open($$(this).attr("href"));
});


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
      var formData = app.formToJSON('#my-form');
      requestServer('post',formData,'listen',function(resp){
          if(resp.status="success"){
              app.alert("Mensaje enviado con exito.");
            }else{
              app.alert("Ha ocurrido un error al enviar su mensaje, intente más tarde.");

            }
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

    requestServer('get',null,'club',function(resp){
        console.log(resp);
        var information_clubs = resp.data;
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
                zoom: 15
              }
            };
          var map = plugin.google.maps.Map.getMap(div,options);
          
         if(information_clubs.length > 0 ){
            for (var x in information_clubs) {
                map.addMarker({
                  position: {lat: information_clubs[x].latitude, lng: information_clubs[x].longitude},
                  title: information_clubs[x].name,
                  snippet: information_clubs[x].description,
                  url: information_clubs[x].url,
                  icon:'../img/umbrela-icon.png'
                })  
            };
             


         }
          var marker = map.addMarker({
            position: {lat: latitude, lng: longitude},
            title: "Nombre",
            snippet: "Descripcin",
            url: 'https://goo.gl/maps/iw1YNgkhkiRoFZSL7'
          })  

          
      }, onError);
    });

    
    // Create a Google Maps native view under the map_canvas div.
    
      
})

$$(document).on('pageInit', '.page[data-page="calendar"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"

    app.closePanel("left");
    var days = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"]
    var month = new Date().getMonth()+1;
    requestServer('get',null,'event/'+month,function(resp){
      console.log(resp)
      var items_config =  []
      for(var x in resp){

          var date = new Date(resp[x].date);
          var f_date = days[date.getDay()]+" "+date.getDate();
          items_config.push({
              title: resp[x].title,
              picture: '../img/umbrella.png',
              hour: resp[x].hour,
              date: f_date
          })
      }
      console.log('items_config',items_config);
      var myList = app.virtualList('.list-block.virtual-list', {
    // Array with items data
        items: items_config,
        // Template 7 template to render each item
        template: '<li class="item-content">' +
                      '<div class="item-media"><img width="30" height="30" src="{{picture}}"></div>' +
                      '<div class="item-inner">' +
                          '<div class="item-title">{{title}}</div>' +
                          '<div class="item-after"> '+
                              '<label class="label-checkbox item-content myList">'+
                               ' <div class="row">'+
                               '   <div class="col-100 text-min">{{date}}</div>'+
                               '   <div class="col-100 text-min">{{hour}}</div>'+
                               ' </div>'+
                              '  <input type="checkbox" name="my-checkbox" value="Movies">'+
                              '  <div class="item-media">'+
                              '    <i class="icon icon-form-checkbox"></i>'+
                              '  </div>'+
                              '</label>'+
                          '</div>'+
                      '</div>' +
                      
                   '</li>'

      });   


    });
})


// onError Callback receives a PositionError object
//
function onError(error) {
    app.alert('code: '    + error.code    + '\n' +
          'message: ' + error.message + '\n');
}




function requestServer(methos_req,data_req,api_get,Callback){
  const options = {
    method: methos_req,
    data: data_req,
   // headers: :{"access-control-allow-origin":"*","etag":"W/\"389-eYsgCPOQs+tx5xhRGXeRM9ScPbY\"","x-powered-by":"Express","content-length":"905","content-type":"application/json; charset=utf-8"
  };
  //enable protocol comunication 
  cordova.plugin.http.sendRequest('http://'+conf.url+':8000/api/'+api_get, options, function(response) {
    // prints 200
    var resp = JSON.parse(response.data);
     Callback(resp)
  }, function(response) {
    // prints 403
    alert("ERROOOR:  "+response.status+"---"+response.error);
  });
}