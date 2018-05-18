class Sensor{
	/* A Class representing a single sensor that can generate random values*/
	constructor(id, latitude, longitude, okRange=[1,10], faultRange=[11,20]){
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
		return [this.latitude, this.longitude];
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

	* valueGenerator(){
		/**
		* A generator that outputs a random sensor value.
		* @return {number} output a random number.
		*/		
		var output = this.ok_value;
		while (true){			
			if( this.on == true){
				if (this.fault == false){
					output = Math.floor(Math.random() * this.okRange[1]) + this.okRange[0];
				}else{
					output = Math.floor(Math.random()* this.faultRange[1]) + this.faultRange[0];
				}
			}else{
				output = 0;
			}
			yield output;
		}
	}
	
}

class SensorNet{
	/* A Class for representing a network of Sensors*/
	constructor(){
		this.sensors = {}; //dictionary of sensors {key: id, value: sensor}
		this.generators = {}; // dictionary of the sensors generators {key: id, value: generator}
	}
	
	addSensor(sensor){
		/** 
		* Add a sensor to the sensor network
		* @param {Sensor} sensor 	a Sensor object
		*/
		this.sensors[sensor.getID()] = sensor;
		this.generators[sensor.getID()] = this.sensors[sensor.getID()].valueGenerator();
	}
	
	getValues(){
		/** 
		* Get the next values of all the sensors
		* @return sensorData 	Array of [[lat, lng, reading], ...] 
		*/
		var sensorData = [];
		var reading = 0;
		for (var key in this.generators){
			reading = this.generators[key].next().value;
			loc = this.sensors[key].getLocation();
			lat = loc[0];
			lng = loc[1];
			sensorData.push([lat, lng, reading]);
		}
		console.log(sensorData);
		return sensorData;
	}
	
	toggleFault(id){
		/** 
		* Toggle if a sensor detects a fault
		* @param {number} id		The id of a sensor
		*/
		if (this.sensors[id] !== undefined){
			this.sensors[id].setFault(true);
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
	let pipeline = new SensorNet();
	
	//point interval in meters
    var interval = 1.0;
    //direction of line in degrees
    //start point
    var lat1 = 37.759639;//43.97076;
    var lng1 = -122.402083;//12.72543;
    // end point
    var lat2 = 37.754608; //43.969730;
    var lng2 = -122.401581;//12.728294;
    var azimuth = MODULE.calculateBearing(lat1,lng1,lat2,lng2);
    console.log(azimuth);
    var coords = MODULE.getLocations(interval,azimuth,lat1,lng1,lat2,lng2);
    console.log(coords);
	
	var counter = 0;
	for (point in coords){
		var s = new Sensor(counter, point[0], point[1]);
		counter += 1;
		pipeline.addSensor(s);
	}
	
	pipeline.getValues();
	
}

//runtest();
testPipeline();