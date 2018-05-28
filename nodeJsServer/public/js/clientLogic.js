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
			mMarker = addInfoMarker(data.params.ID, data.params.type, data.params.lat, data.params.lng, data.params.title, data.params.desc);
			calcSeverity(mMarker, data.params.lat, data.params.lng);
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

function calcSeverity(marker, lat, lng)
{
	if(marker.description == undefined)
		return;
	
	var mLatLng = new google.maps.LatLng(lat, lng);
	var mPoly = undefined;
	var newSev = 1;
	var type = 'polygon';
	for( var index in markerDict[type])
	{
		currPoly = markerDict[type][index];
		if(google.maps.geometry.poly.containsLocation(mLatLng, currPoly))
		{
			mPoly = currPoly;
			console.log("Calculating new sev...");
			
			// "areaInfo":{"address":"Mission Dolores","numPeople":150,"severity":10,"type":"Residential","year":1776}
			// "incident":{"info":"Multiple fatalities","medicNeeded":true,"peopleDanger":true,"reportBy":"Smart City","status":0}}
			
			sev = currPoly.description.areaInfo.severity;
			medicNeeded = marker.description.incident.medicNeeded;
			peopleDanger = marker.description.incident.peopleDanger;
			numPeople = currPoly.description.areaInfo.numPeople;
			
			if(peopleDanger && medicNeeded)
				newSev = 10;
			else if(peopleDanger)
				newSev = 8;
			else if(medicNeeded)
				newSev = 6;
			else
				newSev = 3;
			
			break;
		}
	}
	
	if(mPoly != undefined)
	{
		var nDesc = mPoly.description;
		nDesc.areaInfo.severity = newSev;
		var coordinates = mPoly.getPaths().getArray();
		addPolygon(mPoly.id, coordinates, nDesc);
	}
}