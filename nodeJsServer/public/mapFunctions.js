var mMap;
var markerDict = {};

function myMap()
{
	var mapProp= {
		center:new google.maps.LatLng(37.7749, -122.4194),
		zoom:13
	};
	
	mMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	addInfoMarker("earthquake", 4, 37.7749, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    addInfoMarker("earthquake", 4, 37.7549, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    addInfoMarker("earthquake", 4, 37.7649, -122.4194, "Earthquake!", "Earthquake!", new Date().getTime());
    
	addCircle("circle", 37.7749, -122.4194, 2, new Date().getTime());
}
function addCircle(ID, latitude, longitude, radius, timeAdded) {
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
    }
    
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
			
			//Removes marker from map
			currMarker.setMap(null);
			
			//removes marker from markerDict    
            markerDict[type].splice(index, 1);
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
		
	return marker;
}