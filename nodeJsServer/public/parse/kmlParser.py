import re
import uuid
import sys

placeMark = re.compile("<Placemark>(.*?)</Placemark>", re.DOTALL)
coordinatesTags = re.compile("<coordinates>(.*?)</coordinates>",re.DOTALL)
latlong = re.compile("(-?[0-9]*(.?)[0-9]*,){2}(-?[0-9]*(.?)[0-9]*)\n")
nameTags = re.compile("<name>(.*?)</name>")

def parseKml(kmlFilePath):
	""" Parse a kml file into json
	Parameters
	----------
	kmlFilePath : string
		Path to kml file
	Returns
	-------
	jsonArray  : list
		List of map elements as JSON strings	
	"""
	with open(kmlFilePath, 'r') as kmlFile:
		kmlString = kmlFile.read()		
	
	kmlObj = placeMark.findall(kmlString)
	
	jsonArray = []
	for item in kmlObj:
		if "#poly" in item:
			#addPolygon(String ID, JSONArray coords, desc)
			jsonString = parsePolygon(item)
			jsonArray.append(jsonString)
		elif "#icon" in item:
			#addMarker(string ID, string type, double lat, double lng, string title, JSONObject desc)
			jsonString = parseIcon(item)
			jsonArray.append(jsonString)
		elif "#line" in item:
			#gasLine(JSONArray coords)
			jsonString = parseLine(item)
			jsonArray.append(jsonString)
	
	print(jsonArray)
	return jsonArray
	
def parsePolygon(kmlString):
	'''
	Convert a polygon from kml to json
	
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	jsonString : string
		A polygon in json format
		{"method": "addPolygon", "params":{"ID": "", "coords": , "desc": ""}}
	'''
	polygonTemplate = "{{\"method\": \"addPolygon\", \"params\":{{\"ID\": \"{}\", \"coords\": {}, \"desc\": \"{}\"}}}}"	
	
	jsonCoordsArray = getJsonCoordsArray(kmlString)
	desc = "null"
	jsonString = polygonTemplate.format(uuid.uuid4(),jsonCoordsArray,desc)

	return jsonString
	
def parseIcon(kmlString):
	'''
	Convert a icon from kml to json
	
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	jsonString : string
		A icon in json format
		{"method": "addMarker", "params":{"ID":"", "type": "", "lat": , "lng": , "title": , "desc": ""}}
	'''
	IconTemplate = "{{\"method\": \"addMarker\", \"params\":{{\"ID\":\"{}\", \"type\": \"{}\", \"lat\" : {}, \"lng\" : {}, \"title\": \"{}\", \"desc\" :  \"{}\"}}}}"
	
	coords = getCoords(kmlString)	
	lat = coords[0][0]
	lng = coords[0][1]
	type = "null"
	title = nameTags.findall(kmlString)[0]
	desc = "null"		
	jsonString = IconTemplate.format(uuid.uuid4(),type, lat, lng, title, desc)

	return jsonString
	
def parseLine(kmlString):
	'''
	Convert a line from kml to json
	
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	jsonString : string
		A line in json format
		{"method": "addGasLine", "params":{"ID": "", "coords": , "interval": }}
	'''
	LineTemplate = "{{\"method\": \"addGasLine\", \"params\":{{\"ID\":\"{}\", \"coords\": {}, \"interval\": {}}}}}"
	jsonString = ""
	
	jsonCoordsArray = getJsonCoordsArray(kmlString)
	interval = 1
	jsonString = LineTemplate.format(uuid.uuid4(), jsonCoordsArray, interval)
	return jsonString
	
def getCoords(kmlString):
	""" 
	Parse coordinates from kml file into triples.
	
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	coordTriples : list
		List of [lat,lng,alt] triples
	"""
	coords = coordinatesTags.findall(kmlString)
	coords = coords[0].replace("\n",",").replace(" ","")
	coords = coords.split(",")
	coords = coords[1:-1]	
	coordTriples = [coords[i:i+3] for i in range(0, len(coords),3)]
	
	return coordTriples
	
def getJsonCoordsArray(kmlString):
	"""
	Parse coordinates from kml file into JSON Coordinates Array.
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	jsonCoords : string
		A string in JSON Array format
	"""
	jsonCoords = "["	
	coords = getCoords(kmlString)	
	for i, point in enumerate(coords):
		if i != 0:
			jsonCoords += ","
	
		jsonCoords += "{{\"lat\": {},\"lng\": {} }}".format(point[0],point[1])
			
	jsonCoords += "]"
	return jsonCoords

if __name__ == "__main__":
	if len(sys.argv) != 2:
		print("One File Path argument required\n passed ", len(sys.argv)-1)
	else:
		parseKml(sys.argv[1])