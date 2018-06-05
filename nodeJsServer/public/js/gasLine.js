/**
* Functions for creating gas lines using polylines
* @example
* var gasLine = createGasLine(GAS1, 10);
* var gasSensors = gasLine.sensors;
* var polyline = gasLine.line;
*/

function createLine(ID, sensors, lineCoordinates, lineColour='#FF0000', lineOpacity=1.0, lineWeight=2){
	/**
	* Create a polyline and return it.
	* @param {Array<Object>} lineCoordinates 	Array of {lat : <number>, lng : <number>} points that define the line
	* @param {string} lineColour				Colour as a hexadecimal HTML colour e.g. '#FF0000'
	* @param {number} lineOpacity				Opacity of line in range [0.0, 1.0]
	* @param {number} lineWeight				Line width in pixels
	* @return {PolyLine} line					A google.maps.Polyline object
	*/
	var line = new google.maps.Polyline({
		id : ID,
		path: lineCoordinates,
		geodesic: true,
		strokeColor: lineColour,
		strokeOpacity: lineOpacity,
		strokeWeight: lineWeight,
		sensors: sensors
	});

	return line;
}

function HideLine(line){
	/**
	* Hide a line on the map.
	* @param {Polyline} line	A Polyline object
	*/
	line.setMap(null);
}

function showLine(line, map){
	/**
	* Shows a line on a given map.
	* @param {Polyline} line	A Polyline object
	* @param {Map} 		map		A Map object
	*/
	line.setMap(map);
}

function changeLineColour(line, colour){
	/**
	* Change the colour of a Polyline
	* @param {Polyline} line	A PolyLine object
	* @param {string} 	colour	Colour as a hexadecimal HTML colour e.g. '#FF0000'
	*/
	line.setOptions({strokeColor: colour});
}

function uniqueOnly(coord, index, self){
	/**
	* Check if coordinate objects are equal {lat: , lng:}
	*/
	return index === self.findIndex((t) => (
			t.lat === coord.lat && t.lng === coord.lng
			))
}

function createGasLine(ID, coords, interval, colour){
	/**
	* Create a gas line consisting of a SensorNet and Polyline.
	* @param {Array<Object>} coords The coordinates of the line [{lat:<number>,lng:<number>},...]
	* @param {number} interval The distance between sensors in meters.
	* @param {string} colour colour of lines.
	* @return {Object} {sensors : <SensorNet>, line : <Polyline>}
	*/	
	var uniqueCoords = coords.filter(uniqueOnly); //Remove duplicate coordinates	
	var gasSensors = new SensorNet(uniqueCoords, interval);
	var gasLine = createLine(ID, gasSensors, uniqueCoords, colour);

	return {sensors : gasSensors, line : gasLine};
}