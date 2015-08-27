document.addEventListener("deviceready", onDeviceReady, false); 
function onDeviceReady() {
	$.mobile.defaultPageTransition = 'none';
	$.mobile.defaultDialogTransition = 'none';
	$.mobile.allowCrossDomainPages = true;
	$.mobile.phonegapNavigationEnabled = true;
	$.support.cors = true;
	//sincronizar();
}

var map;

$(document).on("mousedown", ".tabela_home tr td", function() {
	$(this).addClass("ativa");	
});

$(document).on("mouseup", ".tabela_home tr td", function() {
	$(this).removeClass("ativa");	
});

$(document).on("click", ".tabela_home tr td", function() {
	var url = $(this).data('url');
	$( ":mobile-pagecontainer" ).pagecontainer( "change", url );
});

$(document).on("pageshow", "#pontos_descarte", function () {
	/*
	var latitude = -15.797891799999999;
	var longitude = -47.8866393;
	var latLong = new google.maps.LatLng(latitude, longitude);
	var mapOptions = {zoom: 8, center: latLong};
	map = new google.maps.Map(document.getElementById('map-canvas'), mapOptions);
	var marker = new google.maps.Marker({
		position: latLong,
		map: map,
		title: 'Localização',
		snippet: "Population: 4,137,400"
	});
	*/
	var locations = [
		 ['Local A', -15.797891799999999,-47.8866393, 1],
		 ['Local B', -15.798891799999999,-47.8836393, 2],
		 ['Local C', -15.794891799999999,-47.8886393, 3],
		 ['Local D', -15.793891799999999,-47.8896393, 4],
		 ['Local E', -15.791891799999999,-47.8806393, 4],
		 ['Local F', -15.799891799999999,-47.8896393, 4],
	];
	var map = new google.maps.Map(document.getElementById('map-canvas'), {
		 zoom: 15,
		 center: new google.maps.LatLng(-15.797891799999999,-47.8866393),
		 mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	var infowindow = new google.maps.InfoWindow;
	
	var marker, i;
	
	for (i = 0; i < locations.length; i++) {  
		marker = new google.maps.Marker({
			 position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			 map: map
		});
	
		google.maps.event.addListener(marker, 'click', (function(marker, i) {
			 return function() {
				 infowindow.setContent(locations[i][0]);
				 infowindow.open(map, marker);
			 }
		})(marker, i));
	}
});

var map_rastrear;

$(document).on("pageshow", "#rastrear_coleta", function () {
	var locations = [
		 ['Local A', -15.796891799999999,-47.8856393, 1]
	];
	var map_rastrear = new google.maps.Map(document.getElementById('map-canvas-rastrear'), {
		 zoom: 15,
		 center: new google.maps.LatLng(-15.797891799999999,-47.8866393),
		 mapTypeId: google.maps.MapTypeId.ROADMAP
	});
	
	var infowindow = new google.maps.InfoWindow;
	
	var marker, i;
	
	var image = 'img/marker_truck.png';
	
	for (i = 0; i < locations.length; i++) {  
		marker = new google.maps.Marker({
			 position: new google.maps.LatLng(locations[i][1], locations[i][2]),
			 map: map_rastrear,
			 icon: image
		});
		marker.setMap( map_rastrear );
		moveMarker( map_rastrear, marker, -15.800891799999999,-47.8866393 );
	}
});

function moveMarker( map, marker, lat, lng ) {
	lat = lat - 0.00004;
	lng = lng + 0.0001;
	$('p#latlong').html(lat+', <br>'+lng);
    setTimeout( function() {
        marker.setPosition( new google.maps.LatLng( lat,lng ) );
        map.panTo( new google.maps.LatLng( lat,lng ) );
		moveMarker(map, marker, lat, lng);
    }, 800 );
};

$( document ).on( "pageinit" , "#inicio", function () {

});

$(document).on('click', '.capturar_imagem', function(event)
{
	event.preventDefault();
	//sessionStorage.img_uri = $(this).data('img-uri');
	sessionStorage.img_vis = $(this).data('img-vis');
	navigator.camera.getPicture(onSuccess, onFail, { quality: 50, 
	destinationType: Camera.DestinationType.FILE_URI });
});

function onSuccess(imageURI) {
    //var image = document.getElementById('visualizacao_imagem');
    //image.src = imageURI;
	//var img_uri = '#' + sessionStorage.img_uri;
	var img_vis = '#' + sessionStorage.img_vis; 
	$(img_vis, $.mobile.activePage).attr('src', imageURI);
	//$(img_uri, $.mobile.activePage).val(imageURI);
}

function onFail(message) {
    alert('Falha: ' + message);
}

$(document).on('pageinit', '#reportar', function(event)
{
	event.preventDefault();
	navigator.geolocation.getCurrentPosition(onGPSSuccess, onGPSError, {enableHighAccuracy : true});
});

var onGPSSuccess = function(position) {
	var coordenadas = position.coords.latitude + ', ' + position.coords.longitude;
	$('#coordenadas').val(coordenadas);
    /*alert('Latitude: '          + position.coords.latitude          + '\n' +
          'Longitude: '         + position.coords.longitude         + '\n' +
          'Altitude: '          + position.coords.altitude          + '\n' +
          'Accuracy: '          + position.coords.accuracy          + '\n' +
          'Altitude Accuracy: ' + position.coords.altitudeAccuracy  + '\n' +
          'Heading: '           + position.coords.heading           + '\n' +
          'Speed: '             + position.coords.speed             + '\n' +
          'Timestamp: '         + position.timestamp                + '\n');*/
};

// onError Callback receives a PositionError object
//
function onGPSError(error) {
    alert('Erro: ' + error.code + ', Descrição: ' + error.message);
}