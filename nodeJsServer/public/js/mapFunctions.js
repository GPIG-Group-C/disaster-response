var mMap;
var markerDict = {};
var markerCluster;
var sensorCluster;

var layerVisibility = {
	'gas': true, 'fire': true, 'blocked': true, 'medic': true,
    'earthquake': true, 'collapse': true, 'water': true,
    'electricity': true, 'sensor': true, 'circle': true,
	'pipe': true, 'polygon':true
};

var clusterItems = ['gas', 'fire', 'blocked', 'medic', 'earthquake',
                    'collapse', 'water', 'electricity', 'sensor'];

function myMap()
{
	var mapProp= {
		center:new google.maps.LatLng(37.7749, -122.4194),
		zoom:13,
		styles: [{
			"featureType": "poi.attraction",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.business",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.government",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.park",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.place_of_worship",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.sports_complex",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.school",
			"elementType": "labels.text",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "poi.medical",
			"elementType": "labels",
			"stylers": [{"visibility": "on"},
						{"color": "FF0000"}]
		},{
			"featureType": "transit",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "landscape",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		},{
			"featureType": "administrative.neighborhood",
			"elementType": "labels",
			"stylers": [{"visibility": "off"}]
		}]
	};

	mMap = new google.maps.Map(document.getElementById("googleMap"), mapProp);
	markerCluster = new MarkerClusterer(mMap, [], {imagePath: 'media/m'});
	sensorCluster = new MarkerClusterer(mMap, [], {imagePath: 'media/m'});


	addInfoMarker("earthquake", 'earthquake', 37.7749, -122.4194, "Earthquake!", {areaInfo: { address: ""},
																					incident:{
																							status: 1, 
																							reportBy: "", 
																							info: "", 
																							peopleDanger: 0, 
																							medicNeeded:1
																							}});
    addInfoMarker("fire", 'fire', 37.7549, -122.4194, "Fire", {areaInfo: { address: ""},
																					incident:{
																							status: 1, 
																							reportBy: "", 
																							info: "", 
																							peopleDanger: 0, 
																							medicNeeded:1
																							}});
    addInfoMarker("sensor", 'sensor', 37.7649, -122.4194, "Earthquake!", {areaInfo: { address: ""},
																					incident:{
																							status: 1, 
																							reportBy: "", 
																							info: "", 
																							peopleDanger: 0, 
																							medicNeeded:1
																							}});


	addPolygon("polygon", [{lat: 37.747363, lng:-122.459314}, {lat: 37.751939, lng:-122.457014}, {lat: 37.746835, lng:-122.453526}], {areaInfo:{
                                                                                                                                      severity:5
                                                                                                                                     }})

	addCircle("circle", 10, 37.7749, -122.4194, 2);
}



function formatAreaDescr(type, descr){

  var contentString = '<b>AREA INFO</b>'+
  	"<img src='" + "'><br/><br/>" + // Add link to area image
    "<b> Severity: </b> " + descr.areaInfo.severity + "<br/>" +
    "<b> Num People: </b> " + descr.areaInfo.numPeople + "<br/>" +
    "<b> Address: </b> " + descr.areaInfo.address + "<br/>" +
    "<b> Area Type: </b> " + descr.areaInfo.type + "<br/>" +
    "<b> Area Year: </b> " + descr.areaInfo.year + "<br/>" +
    "<b> Updated: </b> " + descr.dateAdded  + "<br/>";

    if (descr.utilities != null) {
    //gasImg = descr.utilities.gas == 0 ?  : ;
    //sewImg = descr.utilities.sewage == 0 ?  : ;
    //watImg = descr.utilities.water == 0 ?  : ;
    //elecImg = descr.utilities.electricity == 0 ?  : ;
    var utilString = '<table style="width:100%">' +
    '<tr>' +
      '<th colspan="2">Utility Status:</th>' +
    '</tr>' +
    '<tr>' +
      '<td>Gas: <img src="' +  + '"></td>' +
      '<td>Sewage: <img src=' +  + '></td>' +
    '</tr>' +
    '<tr>' +
      '<td>Water: <img src=' +  + '></td>' +
      '<td>Electricity: <img src=' +  + '></td>' +
    '</tr>' +
    '</table>';

    contentString = contentString + utilString;
	}

  return contentString;
}

function formatIncidentDescr(type, descr){
  
  var contentString = '<b>INCIDENT INFO</b> <br/>'+ 
  	"<strong> Type: </strong>" + type + '<br/>' +
    "<b> Status: </b> " + descr.incident.status + "<br/>" +
    "<b> Address: </b> " + descr.areaInfo.address + "<br/>" +
    "<b> Reported by: </b> " + descr.incident.reportBy + "<br/>" +
    "<b> Reported at: </b> " + descr.dateAdded + "<br/>" +
    //"<b> Medic Needed: <img src='" + descr.utilities.medicNeeded == 0 ?  :  + "'> <br/>" +
    //"<b> Medic Needed: <img src='" + descr.utilities.peopleDanger == 0 ?  :  + "'> <br/>" +
    "<b> Additional Info: </b>" + descr.incident.info + "<br/>";

    if (descr.utilities != null) {
   // gasImg = descr.utilities.gas == 0 ?  : ;
    //sewImg = descr.utilities.sewage == 0 ?  : ;
    //watImg = descr.utilities.water == 0 ?  : ;
    //elecImg = descr.utilities.electricity == 0 ?  : ;
    var utilString = '<table style="width:100%">' +
    '<tr>' +
      '<th colspan="2">Utility Status:</th>' +
    '</tr>' +
    '<tr>' +
      '<td>Gas: <img src="' +  + '"></td>' +
      '<td>Sewage: <img src=' +  + '></td>' +
    '</tr>' +
    '<tr>' +
      '<td>Water: <img src=' +  + '></td>' +
      '<td>Electricity: <img src=' +  + '></td>' +
    '</tr>' +
    '</table>';
      
    

    contentString = contentString + utilString;
	}

  return contentString;
}


function formatIncidentDescrSide(type, title, descr){

  var h = '<div class="inner__title">'+title+'</div>';
  
  var contentString = '<div class="inner__content">' + '<b>INCIDENT INFO</b> <br/>' +
  	"<strong> Type: </strong>" + type + '<br/>' +
    "<b> Status: </b> " + descr.incident.status + "<br/>" +
    "<b> Address: </b> " + descr.areaInfo.address + "<br/>" +
    "<b> Reported by: </b> " + descr.incident.reportBy + "<br/>" +
    "<b> Reported at: </b> " + descr.dateAdded + "<br/>" +
    //"<b> Medic Needed: <img src='" + descr.utilities.medicNeeded == 0 ?  :  + "'> <br/>" +
    //"<b> Medic Needed: <img src='" + descr.utilities.peopleDanger == 0 ?  :  + "'> <br/>" +
    "<b> Additional Info: </b>" + descr.incident.info + "<br/>";

    if (descr.utilities != null) {
   // gasImg = descr.utilities.gas == 0 ?  : ;
    //sewImg = descr.utilities.sewage == 0 ?  : ;
    //watImg = descr.utilities.water == 0 ?  : ;
    //elecImg = descr.utilities.electricity == 0 ?  : ;
    var utilString = '<table style="width:100%">' +
    '<tr>' +
      '<th colspan="2">Utility Status:</th>' +
    '</tr>' +
    '<tr>' +
      '<td>Gas: <img src="' +  + '"></td>' +
      '<td>Sewage: <img src=' +  + '></td>' +
    '</tr>' +
    '<tr>' +
      '<td>Water: <img src=' +  + '></td>' +
      '<td>Electricity: <img src=' +  + '></td>' +
    '</tr>' +
    '</table>';
      
    var f = '</div>';

    contentString = h + contentString + utilString + f;
	} else {
      contentString = h + contentString + f;
    }

  return contentString;
}



function addCircle(ID, type, latitude, longitude, radius) {
	var circle = new google.maps.Circle({
		strokeColor: 'white',
		strokeWeight: .5,
		fillColor: 'red',
		fillOpacity: .2,
		map: mMap,
		center: {lat: latitude, lng: longitude},
		radius: radius * 1000
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

function addInfoMarker(ID, type, latitude, longitude, title, descr){

	//Check to see if the ID has been used before, remove previous item if it has
	for( var index in markerDict[type]){
		currMarker = markerDict[type][index];

		if (currMarker.id == ID){

			removeMarker(ID, type);
		}
	}

	if (descr !=  null) {
		var cont = formatIncidentDescr(type, descr);
		var infoWindow = new google.maps.InfoWindow({
			content: cont
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
	  case 'collapse':
          icon_url = 'media/collapse.svg'
          break;
      case 'medic':
          icon_url = 'media/medic.svg'
          break;
      case 'earthquake':
          icon_url = 'media/earthquake.svg'
          break;
			case 'fire_station':
		      icon_url = 'media/fs.svg'
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

	if(type != "sensor"){
		addActivityItem(ID, type, latitude, longitude, title, descr);
	}

    if(clusterItems.includes(type)){
        addMarkerToCluster(marker, type);
    }

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
	removeMarkerFromCluster(markerDict[type][index]);

	//Removes marker from markerDict
	markerDict[type].splice(index, 1);

	//Removes activity item
	if(type != "sensor"){
		deleteActivityItem(ID);
	}
}

function addMarkerToCluster(marker, type){
	if(type != "sensor"){
		markerCluster.addMarker(marker);
	} else {
		sensorCluster.addMarker(marker);
	}
}

function removeMarkerFromCluster(marker, type){
	if(type != "sensor"){
		markerCluster.removeMarker(marker);
	} else {
		sensorCluster.removeMarker(marker);
	}
}

function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}

function rgbToHex(r, g, b) {
    return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

function interpolateColours(firstCol, secondCol, p){
  var colour = {R: (firstCol.R * (1 - p) + secondCol.R * p),
               G: (firstCol.G * (1 - p) + secondCol.G * p),
               B: (firstCol.B * (1 - p) + secondCol.B * p)};
  return colour;

}

function calcPolygonColour(severity){
  var firstCol, secondCol, p;
  if(severity < 5){
    firstCol = {R:0, G:255, B:0};
    secondCol = {R:255, G:255, B:0};
    p = severity/5;
  } else {
    firstCol = {R:255, G:255, B:0};
    secondCol = {R:255, G:0, B:0};
    p = (severity - 5)/5;
  }

  var colour = interpolateColours(firstCol, secondCol, p);
  return rgbToHex(Math.round(colour.R), Math.round(colour.G),
                  Math.round(colour.B));
}

function addPolygon(ID, coords, descr){
    var type = 'polygon';

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
		var cont = formatAreaDescr(type, descr);
		var infoWindow = new google.maps.InfoWindow({
			content: cont
		});
	}

	var polygon = new google.maps.Polygon({
		id: ID,
		paths: coords,
		strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: calcPolygonColour(descr.areaInfo.severity),
        fillOpacity: 0.35
	});

	polygon.addListener('click', function(event) {
		infoWindow.setPosition(event.latLng);
		infoWindow.open(mMap);
	});

	polygon.setMap(mMap);

	if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(polygon);
    } else {
        markerDict[type].push(polygon);
    }
}

function addTransparentPolygon(ID, lineColour, coords){
	var type = 'transparentPolygon';

	var polygon = new google.maps.Polygon({
		id: ID,
		paths: coords,
		strokeColor: lineColour,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#000000',
        fillOpacity: 0.0
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
        if(clusterItems.includes(type)){
          removeMarkerFromCluster(markerDict[type][index], type);
        }
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
        if(clusterItems.includes(type)){
           addMarkerToCluster(markerDict[type][index], type);
        }
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
	//Create the main div and Text for item in activity log
    var div = document.createElement('div');
    div.id = ID;
	div.className = 'inner__item' + ' ' + type;
	//div.style = "padding: 5px 1px; width: 240px;";
    div.innerHTML = formatIncidentDescrSide(type, title, descr);

	//insert new item into array of children and re-append
	var childArray = Array.from(document.getElementById('js-sidebar-2').children);
	childArray.splice(1,0,div);
	for (var i =0;i<childArray.length;i++) {
		document.getElementById('js-sidebar-2').appendChild(childArray[i]);
	}

	//Create the revert button for each activity item
	var revertDiv = document.createElement('button');
	revertDiv.id = ID + "_btn";
	revertDiv.type = "button"
	revertDiv.onclick = revertActivityItem;
	revertDiv.innerHTML = "Revert";
	revertDiv.style = "float: right; padding: 0px 3px;";
	document.getElementById(ID).childNodes[1].appendChild(revertDiv);

}

function revertActivityItem() {
	var parent = this.parentNode.parentNode;
	var elem = document.getElementById(parent.id).childNodes[0];
	elem.innerHTML = "Reverted-" + elem.innerHTML;
	elem.style.color = "#A9A9A9";
	revertMarker(parent.id, parent.className.split(' ')[1]);
	document.getElementById(this.id).remove();
    
    // Close item in accordion
    parent.className = parent.className.split(' ')[0];
    var children = parent.childNodes;
    var i;
    for(i = 0; i < children.length; i++){
      children[i].className = children[i].className.split(' ')[0];
    }
}

function revertMarker(ID, type) {
	var index = markerDict[type].map(function(e) { return e.id; }).indexOf(ID);

	//Removes marker from map
	markerDict[type][index].setMap(null);

	//Removes marker from markerCluster
	markerCluster.removeMarker(markerDict[type][index]);

	//Removes marker from markerDict
	markerDict[type].splice(index, 1);

}

function deleteActivityItem(ID) {
	var elem = document.getElementById(ID);
	elem.parentNode.removeChild(elem);
}

function loadStyles() {
	return JSON.parse(styles);
}

function addGasLine(ID, coords, interval){

	var type = "pipe"

	var gas = createGasLine(ID, coords, interval);
	showLine(gas.line, mMap);

	if(!(type in markerDict)){
        markerDict[type] = [];
        markerDict[type].push(gas.line);
    } else {
        markerDict[type].push(gas.line);
    }

	type = "sensor";

	for( var index in gas.sensors.sensors){
		var sensor = gas.sensors.sensors[index];

		var status;
		if(sensor.on){
			status = "Status: On";
		} else {
			status = "Status: Off";
		}

		var sensorID = ID.concat(sensor.id);
		addInfoMarker(sensorID, type, sensor.latitude, sensor.longitude, "Sensor_".concat(sensorID), status, new Date().getTime());
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