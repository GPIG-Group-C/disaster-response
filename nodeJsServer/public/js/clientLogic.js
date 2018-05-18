var socket = io(); //load client & connect to the host
		
// Server notification:
socket.on('notification', function (data) {

	console.log('Received notification');
	
	switch(data.method)
	{
		case "addMarker":
			console.log("addMarker");
			addInfoMarker(data.params.ID, data.params.type, data.params.latitude, data.params.longitude, data.params.title, data.params.desc, data.params.datetime);
			break;

		case "addCircle":
			console.log("addCircle");
			addCircle(data.params.ID, data.params.type, data.params.latitude, data.params.longitude, data.params.radius, data.params.timeAdded);
			break;

	} 

});