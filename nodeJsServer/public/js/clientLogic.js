var socket = io(); //load client & connect to the host

// Server notification:
socket.on('notification', function (data) {

	console.log('Received notification');
	console.log(data);
	console.log(data.length);

	if(data.length == undefined)
	{
		parseJsonRpc(data);
	}
	else
	{
		for(var i = 0; i < data.length; i++)
		{
			parseJsonRpc(data[i]);
		}
	}
});

function parseJsonRpc(data)
{
	switch(data.method)
	{
		case "addMarker":
			console.log("addMarker");
			addInfoMarker(data.params.ID, data.params.type, data.params.lat, data.params.lng, data.params.title, data.params.desc);
			break;

		case "addCircle":
			console.log("addCircle");
			addCircle(data.params.ID, data.params.type, data.params.lat, data.params.lng, data.params.radius);
			break;

		case "addPolygon":
			console.log("addPolygon");
			addPolygon(data.params.ID, data.params.coords, data.params.desc);
			break;

		case "addTransparentPolygon":
			console.log("addPolygon");
			addTransparentPolygon(data.params.ID, data.params.colour, data.params.coords);
			break;

		case "addGasLine":
			console.log("addGasLine");
			addGasLine(data.params.ID, data.params.coords, data.params.interval, data.params.colour);
			break;

	}
}
