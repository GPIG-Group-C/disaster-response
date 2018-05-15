var socket = io(); //load client & connect to the host
		
// Server message:
socket.on('addNewMarker', function (data) {

	// Add to Google Maps:
	var marker = new google.maps.Marker({
	  position: data,
	  map: map
	});
	
	console.log("addNewMarker");
});

