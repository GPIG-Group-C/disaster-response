var mMap;
var markerDict = {};
var markerCluster;

var layerVisibility = {
	'gas': true, 'fire': true, 'blocked': true, 'medic': true, 
    'earthquake': true, 'collapse': true, 'water': true, 
    'electricity': true, 'sensor': true, "circle": true
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
	
	addInfoMarker("earthquake", 'earthquake', 37.7749, -122.4194, "Earthquake!", "Earthquake!");
    addInfoMarker("earthquake1", 'fire', 37.7549, -122.4194, "Earthquake!", "Earthquake!");
    addInfoMarker("earthquake2", 'sensor', 37.7649, -122.4194, "Earthquake!", "Earthquake!");
    
	addPolygon("polygon", 100, 2, [{lat: 37.747363, lng:-122.459314}, {lat: 0.751939, lng:-122.457014}, {lat: 37.746835, lng:-122.453526}], "hey scott")

	addCircle("circle", 10, 37.7749, -122.4194, 2);
}
function addCircle(ID, type, latitude, longitude, radius) {
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

    circleJson = {method: "addCircle", params: {id: ID, type: type, latitude: latitude, longitude: longitude, radius: radius}};
    //socket.emit("broadcastData", circleJson);
    
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

function addInfoMarker(ID, type, latitude, longitude, title, descr){
	
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
  
  
    var icon_url;
    switch(type) {
      case 'gas':
          icon_url = 'media/gas.svg'
          break;
      case 'fire':
          icon_url = 'media/flame.svg'
          break;
      case 'blocked':
          icon_url = 'media/blocked.svg'
          break;
      case 'medic':
          icon_url = 'media/medic.svg'
          break;
      case 'earthquake':
          icon_url = 'media/earthquake.svg'
          break;
      case 'collapse':
          icon_url = 'media/settings.svg'
          break;
      case 'water':
          icon_url = 'media/drop.svg'
          break;
      case 'electricity':
          icon_url = 'media/electricity.svg'
          break;
      case 'sensor':
          icon_url = 'media/sensor.svg'
          break;
    }

  
	var marker = new google.maps.Marker({
		id: ID,
		title: title,
		position: {lat: latitude, lng: longitude}, 
		icon: {
            scaledSize: new google.maps.Size(24, 24),
            origin: new google.maps.Point(0,0),
            url: icon_url
        },
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
	
	addActivityItem(ID, type, latitude, longitude, title, descr);
	
	markerCluster.addMarker(marker);

    markerJson = {method: "addMarker", params: {id: ID, type: type, latitude: latitude, longitude: longitude, title: title, descr: descr}};
	// Do not emit from here
    //socket.emit("broadcastData", markerJson);
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

function addPolygon(ID, type, severity, coords, descr){
	
	//Check to see if the ID has been used before, remove previous item if it has
	for( var index in markerDict[type]){
		currPoly = markerDict[type][index];
		
		
		if (currPoly.id == ID){
			
			currPoly.setMap(null);
			var polyIndex = markerDict[type].map(function(e) { return e.id; }).indexOf(ID);
			markerDict[type].splice(polyIndex, 1);
		}
	}

	// Needs updating
	if (descr !=  null) {
		var infoWindow = new google.maps.InfoWindow({
			content: descr.reportBy
		});
	}
		
	var polygon = new google.maps.Polygon({
		id: ID,
		paths: coords,
		strokeColor: '#FF0000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#FF0000',
        fillOpacity: 0.35
	});
	
	polygon.addListener('click', function(event) {
		infoWindow.setPosition(event.latLng);
		infoWindow.open(mMap);
		console.log("aaaahhhh");
	});
	
	polygon.setMap(mMap);

	if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(polygon);
    } else {
        markerDict[type].push(polygon);
    }
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

function addActivityItem(ID, type, latitude, longitude, title, descr) {
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
	
	var type = "sensor";
	
	var gas = createGasLine(ID, coords, interval);
	showLine(gas.line, mMap);
	
	if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(gas.line);
    } else {
        markerDict[type].push(gas.line);
    }
	
	for( var index in gas.sensors.sensors){
		var sensor = gas.sensors.sensors[index];
		
		console.log(sensor);
		
		var status;
		if(sensor.on){
			status = "Status: On";
		} else {
			status = "Status: Off";
		}
		
		var sensorID = ID.concat(sensor.id);
		addInfoMarker(sensorID, "gas", sensor.latitude, sensor.longitude, "Sensor_".concat(sensorID), status, new Date().getTime());
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