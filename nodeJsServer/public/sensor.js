class Sensor{
	constructor(id, latitude, longitude, ok_value=5, error_change=2){
		this.id = id;
		this.latitude = latitude;
		this.longitude = longitude;
		this.ok_value = ok_value;
		this.error_change = error_change;
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
		this.on = active;
	}
	
	setFault(faulty){
		this.fault = faulty;
	}

	* valueGenerator(){
		/* A generator that outputs a random sensor value.
		Params
			None
		Returns
			output		a float value
		*/		
		var upper = (this.ok_value + this.error_change);
		var lower = (this.ok_value - this.error_change);
		var output = this.ok_value;
		while (true){			
			if( this.on == true){
				if (this.fault == false){
					output = Math.floor(Math.random() * upper) + lower;
				}else{
					output = Math.floor(Math.random()* 20) + 10;
				}
			}else{
				output = 0;
			}
			yield output;
		}
	}
	
}

class SensorNet{
	constructor(){
		this.sensors = {}; //dictionary of sensors
		this.generators = {};
	}
	
	addSensor(sensor){
		/* Add a sensor to the sensor network
		Params
			sensor		a sensor
		*/
		this.sensors[sensor.getID()] = sensor;
		this.generators[sensor.getID()] = this.sensors[sensor.getID()].valueGenerator();
	}
	
	getValues(){
		/* Get the values of all the sensors */
		var sensorData = [];
		var reading = 0;
		for (var key in this.generators){
			reading = this.generators[key].next().value;
			sensorData.push([this.sensors[key].getLocation(), reading]);
			console.log(reading);
		}
		console.log(sensorData);
		return sensorData;
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