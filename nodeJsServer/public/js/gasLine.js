/* Functions for creating gas lines using polylines*/

function createLine(lineCoordinates, lineColour='#FF0000', lineOpacity=1.0, lineWeight=2){
	/**
	* Create a polyline and return it.
	* @param {Array<number>} lineCoordinates 	Array of {lat, long} points that define the line
	* @param {string} lineColour				Colour as a hexadecimal HTML colour e.g. '#FF0000'
	* @param {number} lineOpacity				Opacity of line in range [0.0, 1.0]
	* @param {number} lineWeight				Line width in pixels
	* @return {PolyLine} line					A google.maps.Polyline object
	*/
	var line = new google.maps.Polyline({
		path: lineCoordinates,
		geodesic: true,
		strokeColor: lineColour,
		strokeOpacity: lineOpacity,
		strokeWeight: lineWeight
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