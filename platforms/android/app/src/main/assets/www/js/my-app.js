
// Initialize app
var app = new Framework7({
  panel: {
    swipe: 'left',
  }
});

var env = "sandbox";//production -sandbox
var conf = {
    sandbox:{
      url: "192.168.0.8"//localhost
    },
    production:{
      url: /*"10.100.73.3"*/ "192.168.111.22"
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
    // $('.listen-img').css("background-image", 'url("http://'+conf.url+':8000/public/img/escuchemos.png")'); 
    $('.theme-gray i.icon-bars').css("background-image", 'url("img/ham-men.png")');   
    $('.listen-img').css("background-image", 'url("img/escuchemos.png")');  
    $('.video-img').css("background-image", 'url("img/juntos2.png")');  
    $('.calendar-img').css("background-image", 'url("img/agenda.png")');  
    $('.net-img').css("background-image", 'url("img/red.png")');  
    $('.club-img').css("background-image", 'url("img/clubs.png")');  
    $('.img-background').css("background-image", 'url("img/juntos.png")');  
});





// Option 2. Using live 'pageInit' event handlers for each page
$$(document).on('pageInit', '.page[data-page="index"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    loader("none","222426","");
      $('.img-background').css("background-image", 'url("img/juntos.png")');  

})
$$(document).on('pageInit', '.page[data-page="faq"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    loader('url("img/red.png")',"ed9022","Red de Atención");



    requestServer('get',null,'location',function(resp){
        
        var information_location = resp.data;

        console.log('information_location',information_location);
        var arr_i = {};
        for(var x in information_location){
            arr_i[information_location[x]._id]= information_location[x].information;
            arr_i[information_location[x]._id].name= information_location[x].name;
        }

        var template ="";
        for(var x in arr_i){
          template+='<li class="accordion-item">'+
           '     <a href="" class="item-link item-content">'+
           '         <div class="item-inner">'+
           '             <div class="item-title">'+arr_i[x].name+'</div>'+
           '         </div>'+
           '     </a> ';
           var locations = arr_i[x].locations;
           for(var y in locations){
                template+='     <div class="accordion-item-content " ><a id="'+x+'-'+y+'" class="show-modal-info" href="" >'+locations[y].name+'</a></div>';
            
           }
           
           template+=' </li>';
        }

        $(".mylist").html(template);
        $$(".show-modal-info").on('click',function(){
            var id = this.id.split("-");
            var popupHTML = 
           
              '<div class="popup" style="background-color:#222426 !important;">'+
               '<div class="page-content theme-gray">'+
                '<div class="content-block ">'+
                  '<p><a href="#" class="close-popup"><i class="f7-icons list-icons">close</i></a></p>'+
                  
                    '<h3 class="title-modal">'+arr_i[id[0]].name+'</h3>'+
                    '<h4 class="title-modal">'+arr_i[id[0]]['locations'][id[1]].name+'</h4>'+
                    '<h4 class="title-modal">'+arr_i[id[0]]['locations'][id[1]].description+'</h4>'+
                    '<h4 class="title-modal">'+arr_i[id[0]]['locations'][id[1]].address+'</h4>'+
                '</div>'+
              '</div>'+
            '</div>'
         app.popup(popupHTML);
        }) 

    });
            
    

})

$$(document).on('pageInit', '.page[data-page="video"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"
    loader('url("img/juntos2.png")',"40abf9","Juntos TV")
    
})

$$(document).on('pageInit', '.page[data-page="listen"]', function (e) {

    // Following code will be executed for page with data-page attribute equal to "about"
    loader('url("img/escuchemos.png")','41c3a5','Escuchemos')
    //$$(".banner-action").html('<h3 class="center-text">Cuentanos tu historia, <br> te queremos escuchar</h3>'); 
    $$('.form-to-data').on('click', function(){
      var formData = app.formToJSON('#my-form');
      requestServer('post',formData,'listen',function(resp){
          if(resp.status="success"){
              app.alert("Gracias","Mensaje enviado con exito.");
            }else{
              app.alert("Error","Ha ocurrido un error al enviar su mensaje");

            }
      });
    }); 
})


function getMap(information_clubs,Callback){

  navigator.geolocation.getCurrentPosition(function(position){
          
          var div = document.getElementById("map_canvas");
          plugin.google.maps.environment.setEnv({
            'API_KEY_FOR_BROWSER_RELEASE': 'AIzaSyBe0T8526348cBO2vigGAsNqqCS-jwy8Ck',
            'API_KEY_FOR_BROWSER_DEBUG': 'AIzaSyBe0T8526348cBO2vigGAsNqqCS-jwy8Ck'
          });
          // var element = document.getElementById('geolocation');
          // element.innerHTML = 'Latitude: '           + position.coords.latitude              + '<br />' +
          //                     'Longitude: '          + position.coords.longitude             + '<br />' ;
          latitude = position.coords.latitude; // Latitud
          longitude = position.coords.longitude; // Longitud
          var options = {
              camera: {
                target: {lat: latitude, lng: longitude},
                zoom: 15
              },
              backgroundColor: '#222426'
              // styles: [
              //   {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
              // ]
            };
          var map = plugin.google.maps.Map.getMap(div,options);
          
         if(information_clubs.length > 0 ){
            for (var x in information_clubs) {
                map.addMarker({
                  position: {lat: information_clubs[x].latitude, lng: information_clubs[x].longitude},
                  title: information_clubs[x].name,
                  snippet: information_clubs[x].description,
                  url: information_clubs[x].url,
                  icon: 'http://'+conf.url+':8000/public/img/umbrela-icon.png'
                })  
            };
         }
          var marker = map.addMarker({
            position: {lat: latitude, lng: longitude},
            title: "Nombre",
            snippet: "Descripcin",
            url: 'https://goo.gl/maps/iw1YNgkhkiRoFZSL7'
          })  
          div.style.backgroundColor = "#222426 !important";
          map.one(plugin.google.maps.event.MAP_READY, function() {
            Callback(div);
          });
          //debugger;
          
      }, onError);

}

$$(document).on('pageInit', '.page[data-page="mapad"]', function (e) {
  


    // Following code will be executed for page with data-page attribute equal to "about"
    //debugger;
    loader('url("img/clubs.png")',"222832","Clubs")
    requestServer('get',null,'club',function(resp){
        console.log(resp);
        var information_clubs = resp.data;
        getMap(information_clubs,function(div){

            $$(".page-content").css("background-color","#222426"); 

        })

    });

    
    // Create a Google Maps native view under the map_canvas div.
    
      
})

$$(document).on('pageInit', '.page[data-page="calendar"]', function (e) {
    // Following code will be executed for page with data-page attribute equal to "about"


    loader('url("img/agenda.png")',"bfc325","Agenda")
    var days = ["Dom","Lun","Mar","Mie","Jue","Vie","Sab"];
    var months= ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];
    var month = new Date().getMonth()+1;
    var year = new Date().getFullYear()
    $$(".month-event").html(months[month-1]+" "+year);
    requestServer('get',null,'event/'+month,function(resp){
      console.log(resp)
      var items_config =  [];
      var info_fast = {};
      for(var x in resp){

          var date = new Date(resp[x].date);
          var f_date = days[date.getDay()]+" "+date.getDate();

          var struncture = {
              title: resp[x].title,
              picture: 'http://'+conf.url+':8000/public/img/umbrella.png',
              hour: resp[x].hour,
              date: f_date,
              id:   resp[x]._id,
              address: resp[x].address,
              image: resp[x].image,
              description: resp[x].description,

          };
          items_config.push(struncture);
          info_fast[resp[x]._id]= struncture;
      }
      console.log('items_config',items_config);
      console.log('info_fast',info_fast);

    //   var myList = app.virtualList('.list-block.virtual-list', {
    // // Array with items data
    //     items: items_config,
    //     // Template 7 template to render each item
    //     template: 
    //               '<li>'+
    //                   '  <a href="#" class="item-link item-content ">'+
    //                   '    <div class="item-media">'+
    //                   '     <div class="row">'+
    //                   '          <div class="col-100 text-min">{{date}}</div>'+
    //                   '          <div class="col-100 text-min">{{hour}}</div>'+
    //                   '        </div>'+
    //                   '    </div>'+
    //                   '    <div class="item-inner">'+
    //                   '      <div class="item-title-row">'+
    //                   '        <div class="item-title">{{title}}</div>'+
    //                   '      </div>'+
    //                   '      <div class="item-subtitle">{{address}}</div>'+
    //                   '    </div>'+
    //                   '  </a>'+
    //                   '</li>'

    //   });   
      var myList = app.virtualList('.list-block.virtual-list', {
    // Array with items data
        items: items_config,
        // Template 7 template to render each item
        template: '<li class="item-content">' +
                      '<div class="item-media"><img width="30" height="30" src="{{picture}}"></div>' +
                      '<div class="item-inner">' +
                          '<div class="item-title text-bold">{{title}}</div>' +
                          '<div class="item-after"> '+
                              '<label class="label-checkbox item-content myList">'+
                               ' <div class="row">'+
                               '   <div class="col-100 text-min">{{date}}</div>'+
                               '   <div class="col-100 text-min">{{hour}}</div>'+
                               ' </div>'+
                              '  <input type="radio" name="radio-event" value="{{id}}" >'+
                              '  <div class="item-media">'+
                              '    <i class="icon icon-form-checkbox"></i>'+
                              '  </div>'+
                              '</label>'+
                          '</div>'+
                      '</div>' +
                      
                   '</li>'

      });   

      $$('input[type=radio][name=radio-event]').change(function() {
        console.log(info_fast[this.value])
           var popupHTML = 
               
                  '<div class="popup" style="background-color:#222426 !important;">'+
                   '<div class="page-content theme-gray">'+
                    '<div class="content-block ">'+
                      '<p><a href="#" class="close-popup"><i class="f7-icons list-icons">close</i></a></p>'+
                      
                        '<h3 class="title-modal">'+info_fast[this.value].title+'</h3>'+
                        '<p class="information-modal"><b>¿Cuándo?</b> <br>'+info_fast[this.value].date+
                        ' la hora del evento será a las '+info_fast[this.value].hour+' </p>'+
                        '<p class="information-modal"><b>Información del evento: </b>'+info_fast[this.value].description+'</p>'+
                        '<p class="information-modal"><b>¿En dónde?</b><br>'+info_fast[this.value].address+'</p>'+
                        '<img src="http://'+conf.url+':8000/public/img/'+info_fast[this.value].image+'" width="100%" height="200" >'+

                    '</div>'+
                  '</div>'+
                '</div>'
             app.popup(popupHTML);
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



function loader(image,color,title){
  $$(".title-nav").html(title)
  $$(".navbar").css("background-color","#"+color);
  $$(".navbar-inner").css("background-image", image); 
  $$(".navbar-inner").css("background-repeat", 'no-repeat'); 
  app.closePanel("left");
  app.showPreloader();
  setTimeout(function () {
      app.hidePreloader();
  }, 1000);
}