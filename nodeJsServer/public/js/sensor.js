class Sensor{
	/**
	* A Class representing a single sensor that can generate random values
	*/
	constructor(id, latitude, longitude, okRange=[11,20], faultRange=[1,10]){
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		this.okRange = okRange;
		this.faultRange = faultRange;
		this.fault = false;
		this.on = true;
		this.data = this.valueGenerator();
	}
	
	getID(){
		return this.id;
	}
	
	getLocation(){
		/** 
		* Return location of sensor.
		* @return	{Object} {lat : <number, lng : <number>}
		*/
		return {lat : this.latitude, lng : this.longitude};
	}
	
	setOnOff(active){
		/**
		* Turn the sensor on or off, if off the sensor outputs 0.
		* @param {boolean} active If True sensor is set on, if False off.
		*/
		this.on = active;
	}
	
	setFault(faulty){
		/**
		* Set the sensor to return a value outside the normal range.
		* @params {boolean} faulty 	If True return a unexpected value.
		*/
		this.fault = faulty;
	}
	
	generatingFault(){
		/** 
		* Check if the sensor is currently producing a fault,
		* i.e. is this.fault set to true.
		* @return {boolean} True if sensor is producing a fault.
		*/
		return this.fault;
	}

	* valueGenerator(){
		/**
		* A generator that outputs a random sensor value.
		* @return {number} output a random number.
		*/		
		var output = this.okRange[0];
		var max = 0;
		var min = 0;
		while (true){			
			if( this.on == true){
				if (this.fault == false){
					max = this.okRange[1];
					min = this.okRange[0];
					output = Math.floor(Math.random()*(max-min+1)+min);
				}else{
					max = this.faultRange[1];
					min = this.faultRange[0];
					output = Math.floor(Math.random()*(max-min+1)+min);
				}
			}else{
				output = 0;
			}
			yield output;
		}
	}
	
}

class SensorNet{
	/**
	* A Class for representing a line of Sensors
	*/
	constructor(lineCoords, interval){
		/**
		* @param {Array<Object>} 	lineCoords 	An array of lat long pairs, {lat : , lng :}, 
												defining the corners of the line.
		* @param {number} 			interval 	The distance between sensors in meters.
		*/
		this.sensorCoords = []; // Array of coords as {lat: <number> , lng : <number>}
		this.sensors = {}; 		// dictionary of sensors , key: id, value: sensor
		this.generators = {}; 	// dictionary of the sensors generators , key: id, value: generator
		
		// Calculate the locations of all the sensors using the coordinates and interval
		var azimuth = 0;		
		var coord1 = [];
		var coord2 = [];
		var i = 0;
		for (i = 0; i <= lineCoords.length - 2; i++){
			coord1 = lineCoords[i];
			coord2 = lineCoords[i+1];
			azimuth = LOCUTILS.calculateBearing(coord1.lat, coord1.lng, coord2.lat, coord2.lng);
			this.sensorCoords = this.sensorCoords.concat(LOCUTILS.getLocations(interval, azimuth, coord1.lat, coord1.lng, coord2.lat, coord2.lng));
		}
		// Create a sensor for each location, populate this.sensors and this.generators
		var counter = 0;
		for (var j = 0; j < this.sensorCoords.length; j++){
			this.addSensor(new Sensor(counter, this.sensorCoords[j].lat, this.sensorCoords[j].lat));
			counter += 1;
		}
		
	}
	
	getSensors(){
		return this.sensors;
	}
		
	getSensorCoords(){
		return this.sensorCoords;
	}
	
	addSensor(sensor){
		/** 
		* Add a sensor and its generator to the SensorNet
		* @param {Sensor} sensor 	a Sensor object
		*/
		this.sensors[sensor.getID()] = sensor;
		this.generators[sensor.getID()] = this.sensors[sensor.getID()].valueGenerator();
	}
	
	getValues(){
		/** 
		* Get the next values of all the sensors
		* @return {Array<number>} sensorData 	Array of [[id, lat, lng, reading], ...] 
		*/
		var sensorData = [];
		var reading = 0;
		var loc = {};
		for (var key in this.generators){
			reading = this.generators[key].next().value;
			loc = this.sensors[key].getLocation();
			sensorData.push([parseInt(key), loc.lat, loc.lng, reading]);
		}
		return sensorData;
	}
	
	toggleFault(id){
		/** 
		* Toggle if a sensor is generating a fault
		* @param {number} id		The id of a sensor
		*/
		if (this.sensors[id] !== undefined){
			this.sensors[id].setFault(!this.sensors[id].generatingFault());
		}
	}
}

function runtest(){
	let s1 = new Sensor(1, 2, 3);
	var s1_gen = s1.valueGenerator();
	var i;
	for (i = 0; i < 5; i++) { 
		console.log(s1_gen.next().value);
	}
	s1.setFault(true);
	for (i = 0; i < 5; i++) { 
		console.log(s1_gen.next().value);
	}	
	s1.setFault(false);
	for (i = 0; i < 5; i++) { 
		console.log(s1_gen.next().value);
	}	
	s1.setOnOff(false);
	for (i = 0; i < 5; i++) { 
		console.log(s1_gen.next().value);
	}	
}	

function testPipeline(){
	// Create a pipline and get some values from the sensors
	var pipeline = new SensorNet(GAS2, 10);	
	console.log(pipeline.getValues());
	pipeline.toggleFault(0);
	console.log(pipeline.getValues());
}

//runtest();
//testPipeline();