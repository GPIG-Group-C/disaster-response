var MODULE = (function (){
	var my = {};
	
	my.getPathLength = function(lat1,lng1,lat2,lng2){
		/* Calculate the distance between two points*/
		
		const R = 6371000 // radius of earth in m;
		var lat1rads = my.toRadians(lat1);
		var lat2rads = my.toRadians(lat2);
		var deltaLat = my.toRadians((lat2-lat1));
		var deltaLng = my.toRadians((lng2-lng1));
		var a = Math.sin(deltaLat/2) * Math.sin(deltaLat/2) + Math.cos(lat1rads) * Math.cos(lat2rads) * Math.sin(deltaLng/2) * Math.sin(deltaLng/2);
		var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
		var d = R * c;
		
		return d;
	};


	my.getDestinationLatLong = function(lat,lng,azimuth,distance){
		/*returns the lat an long of destination point 
		given the start lat, long, aziuth, and distance*/
		
		const R = 6378.1; //Radius of the Earth in km;
		var brng = my.toRadians(azimuth); //Bearing is degrees converted to my.toRadians.
		var d = distance/1000; //Distance m converted to km
		var lat1 = my.toRadians(lat); //Current dd lat point converted to my.toRadians
		var lon1 = my.toRadians(lng); //Current dd long point converted to my.toRadians
		var lat2 = Math.asin(Math.sin(lat1) * Math.cos(d/R) + Math.cos(lat1)* Math.sin(d/R)* Math.cos(brng));
		var lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(d/R)* Math.cos(lat1), Math.cos(d/R)- Math.sin(lat1)* Math.sin(lat2));
		
		//convert back to degrees
		lat2 = my.toDegrees(lat2);
		lon2 = my.toDegrees(lon2);
		
		return [lat2, lon2];
	};

	my.calculateBearing = function(lat1,lng1,lat2,lng2){
		/*calculates the azimuth in degrees from start point to end point*/
		
		var startLat = my.toRadians(lat1);
		var startLong = my.toRadians(lng1);
		var endLat = my.toRadians(lat2);
		var endLong = my.toRadians(lng2);
		var dLong = endLong - startLong;
		var dPhi = Math.log(Math.tan(endLat/2.0+Math.PI/4.0)/Math.tan(startLat/2.0+Math.PI/4.0));
		if (Math.abs(dLong) > Math.PI){
			 if (dLong > 0.0){
				 dLong = -(2.0 * Math.PI - dLong);
			 }else{
				 dLong = (2.0 * Math.PI + dLong);
			 }
		}
		var bearing = (my.toDegrees(Math.atan2(dLong, dPhi)) + 360.0) % 360.0;
		
		return bearing;
	};

	my.getLocations = function(interval,azimuth,lat1,lng1,lat2,lng2){
		/*returns every coordinate pair inbetween two coordinate 
		pairs given the desired interval*/

		var d = my.getPathLength(lat1,lng1,lat2,lng2);
		var remainder = ((d / interval) % 1).toFixed(6);
		var dist = (d / interval) - ((d / interval) % 1).toFixed(6);
		var counter = interval;
		var coords = [];
		coords.push([lat1,lng1]);
		var loopArray = Array.from({length: dist.toFixed(0)}, (x,i) => i);//Array.apply(null, Array(dist.toFixed(0))).map(function (_, i) {return i;});
		console.log(loopArray);
		for (distance in loopArray){
			var coord = my.getDestinationLatLong(lat1,lng1,azimuth,counter);
			counter = counter + interval;
			coords.push(coord);
		}
		coords.push([lat2,lng2]);
		
		return coords;
	};
	
	my.toDegrees = function(angle) {
		return angle * (180 / Math.PI);
	};
	
	my.toRadians = function(angle) {
		return angle * (Math.PI / 180);
	};
	
	return my;
}());