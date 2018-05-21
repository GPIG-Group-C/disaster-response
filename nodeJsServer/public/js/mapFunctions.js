var mMap;
var markerDict = {};
var markerCluster;

var layerVisibility = {
	4:true,
	"circle":true
};

function myMap()
{
	var mapProp= {
		center:new google.maps.LatLng(37.7749, -122.4194),
		zoom:13,
		styles: [{
			"featureType": "poi.attraction",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.business",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.government",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.park",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.place_of_worship",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.school ",
			"elementType": "labels",
			"stylers": [{"visibility": "on"}]

		},
		{
			"featureType": "poi.sports_complex ",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "poi.medical ",
			"elementType": "labels",
			"stylers": [{"visibility": "on"},
			{"color": "FF0000"}]

		},
		{
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		},
		{
			"featureType": "road",
			"elementType": "labels",
			"stylers": [{"visibility": "simplified"}]

		},
		{
			"featureType": "administrative.neighborhood",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]

		}
		]
	};
	
	
	
	
	mMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	markerCluster = new MarkerClusterer(mMap, markerDict[4], {imagePath: '../public/media/m'});
	
	addInfoMarker("earthquake", 4, 37.7749, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    addInfoMarker("earthquake", 4, 37.7549, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    addInfoMarker("earthquake", 4, 37.7649, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    

	addCircle("circle", 10, 37.7749, -122.4194, 2, new Date().getTime());
	console.log(markerCluster);
}
function addCircle(ID, type, latitude, longitude, radius, timeAdded) {
	var circle = new google.maps.Circle({
		strokeColor: 'white',
		strokeWeight: .5,
		fillColor: 'red',
		fillOpacity: .2,
		map: mMap,
		center: {lat: latitude, lng: longitude},
		radius: radius * 10000
	});
    
    if(!('circle' in markerDict)){
        markerDict['circle'] = [];
        markerDict['circle'].push(circle);
    } else {
        markerDict['circle'].push(circle);
    };

    circleJson = {method: "addCircle", params: {id: ID, type: type, latitude: latitude, longitude: longitude, radius: radius, timeAdded: timeAdded}};

    socket.emit("broadcastData", circleJson);
    
	return circle;
}

var iconBase = 'https://maps.google.com/mapfiles/kml/shapes/';
        var icons = {
          parking: {
            icon: iconBase + 'parking_lot_maps.png'
          },
          library: {
            icon: iconBase + 'library_maps.png'
          },
          info: {
            icon: iconBase + 'info-i_maps.png'
          }
        };

function addInfoMarker(ID, type, latitude, longitude, title, descr, timeAdded){
	
	//Check to see if the ID has been used before, remove previous item if it has
	for( var index in markerDict[type]){
		currMarker = markerDict[type][index];
		
		if (currMarker.id == ID){
			
			removeMarker(ID, type);
		}
	}
	
	if (descr !=  null) {
		var infoWindow = new google.maps.InfoWindow({
			content: descr
		});
	}
	
	var marker = new google.maps.Marker({
		id: ID,
		title: title,
		position: {lat: latitude, lng: longitude}, 
		map: mMap
	});
	marker.addListener('click', function() {
		infoWindow.open(mMap, marker);
	});
	
    if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(marker);
    } else {
        markerDict[type].push(marker);
    }
	
	addActivityItem(ID, type, latitude, longitude, title, descr, timeAdded);
	
	markerCluster.addMarker(marker);

    markerJson = {method: "addInfoMarker", params: {id: ID, type: type, latitude: latitude, longitude: longitude, title: title, descr: descr, timeAdded: timeAdded}};

    socket.emit("broadcastData", markerJson);
		
	return marker;
}

function removeMarker(ID, type){
	
	var index = markerDict[type].map(function(e) { return e.id; }).indexOf(ID);
	
	//Removes marker from map
	markerDict[type][index].setMap(null);
	
	//Removes marker from markerCluster
	markerCluster.removeMarker(markerDict[type][index]);
	
	//Removes marker from markerDict    
	markerDict[type].splice(index, 1);
	
	//Removes activity item
	deleteActivityItem(ID);
}

function hideLayer(type){
	
	//Hides markers
    for( var index in markerDict[type]){
		markerDict[type][index].setVisible(false);
		layerVisibility[type] = false;
	}
	
	var activityItems = $("#home").children("."+ (type.toString()) );
	
	//Hides activity items
	//Uses Array.from(), not sure if that's an issue.
	for( var index in Array.from(activityItems)){
		item = activityItems[index];
		item.style.display = "none";
	}
}

function showLayer(type){
	//Shows markers
    for( var index in markerDict[type]){
		markerDict[type][index].setVisible(true);
		layerVisibility[type] = true;
	}
	
	var activityItems = $("#home").children("."+ (type.toString()) );
	
	//Shows activity items
	//Uses Array.from(), not sure if that's an issue.
	for( var index in Array.from(activityItems)){
		item = activityItems[index];
		item.style.display = "";
	}
}

function toggleLayer(type){
	if(layerVisibility[type] == true){
		hideLayer(type);
	} else {
		showLayer(type);
	}
}

function addActivityItem(ID, type, latitude, longitude, title, descr, timeAdded) {
    var div = document.createElement('div');

    div.id = ID;
	div.className = type;
    div.innerHTML = descr;

    document.getElementById('home').appendChild(div);
}

function deleteActivityItem(ID) {
	var elem = document.getElementById(ID);
	elem.parentNode.removeChild(elem);
}

function loadStyles() {
	return JSON.parse(styles);
}

function addGasLine(ID, coords, interval){
	
	var type = "gas";
	
	var gas = createGasLine(ID, coords, interval);
	showLine(gas.line, mMap);
	
	if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(gas.line);
    } else {
        markerDict[type].push(gas.line);
    }
	
	console.log(gas.sensors.sensors)
	
	for( var index in gas.sensors.sensors){
		var sensor = gas.sensors.sensors[index];
		
		console.log(sensor.latitude)
		console.log(sensor.longitude)
		addInfoMarker(ID.concat(sensor.id), "gas", sensor.latitude, sensor.longitude, "Gas Sensor", "descr", new Date().getTime());
	}
}

function colourGasLine(ID, colour){
	var gasLine = markerDict["gas"]
	
	for( var index in markerDict["gas"]){
		currLine = markerDict["gas"][index];
		
		if (currLine.id == ID){
			changeLineColour(currLine, colour);
		}
	}
}