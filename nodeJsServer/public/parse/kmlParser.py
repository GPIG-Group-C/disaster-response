import re
import uuid
import sys
import json

placeMark = re.compile("<Placemark>(.*?)</Placemark>", re.DOTALL)
coordinatesTags = re.compile("<coordinates>(.*?)</coordinates>",re.DOTALL)
latlong = re.compile("(-?[0-9]*(.?)[0-9]*,){2}(-?[0-9]*(.?)[0-9]*)\n")
nameTags = re.compile("<name>(.*?)</name>")
typeTags = re.compile("<styleUrl>#icon-(.*?)-nodesc</styleUrl>")

# Icon types, the keys are from the extracted kml file
TYPES = {"1571-E65100" : "fire",
		"1703-0288D1" : "water",
		"1653-0F9D58" : "gas",
		"1499-000000" : "sensor",
		"1660-FFEA00" : "electricity",
		"1884-FF5252" : "blocked",
		"1598-000000" : "collapse",
		"1558-F9A825" : "medic",
		"1563-A52714" : "earthquake",
		"1790-A52714" : "fire_station"}

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
		global kml
		kml = kmlFile.read()

	kmlObj = placeMark.findall(kml)

	jsonArray = []
	for item in kmlObj:
		if "#poly" in item:
			#addPolygon(String ID, JSONArray coords, desc)
			jsonString = parsePolygon(item)
			jsonArray.append(json.loads(jsonString))
		elif "#icon" in item:
			#addMarker(string ID, string type, double lat, double lng, string title, JSONObject desc)
			jsonString = parseIcon(item)
			jsonArray.append(json.loads(jsonString))
		elif "#line" in item:
			#gasLine(JSONArray coords)
			jsonString = parseLine(item)
			jsonArray.append(json.loads(jsonString))

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
	polygonTemplate = "{{\"method\": \"addPolygon\", \"params\":{{\"ID\": \"{}\", \"coords\": {}, \"desc\": {}}}}}"
	tPolygonTemplate = "{{\"method\": \"addTransparentPolygon\", \"params\":{{\"ID\": \"{}\", \"coords\": {}, \"colour\": \"{}\"}}}}"
	jsonCoordsArray = getJsonCoordsArray(kmlString)

	# Use name tag to parse polygon severity
	name = nameTags.findall(kmlString)[0]
	if "Alpha" not in name:
		sev = int(name)
		desc = json.dumps({"dateAdded" : 1, "areaInfo" : {"numPeople": 100, "type": "park", "year":1995, "address": "fake st", "severity": sev}, "utilities" : { "gas": True, "water": True, "electricity": True, "sewage": True}})
		return polygonTemplate.format(uuid.uuid4(), jsonCoordsArray, desc)
	else:
		ID = styleTags.findall(kmlString)[0]
		return tPolygonTemplate.format(uuid.uuid4(), jsonCoordsArray, "#FF0000")

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
	IconTemplate = "{{\"method\": \"addMarker\", \"params\":{{\"ID\":\"{}\", \"type\": \"{}\", \"lat\" : {}, \"lng\" : {}, \"title\": \"{}\", \"desc\" : {}}}}}"

	coords = getCoords(kmlString)
	lat = coords[0][1]
	lng = coords[0][0]
	type = getType(kmlString)
	title = nameTags.findall(kmlString)[0]
	desc = json.dumps({"dateAdded" : 1, "incident" : { "status": 1, "reportBy": "Smart City", "info": "...", "peopleDanger": True, "medicNeeded": True}})
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
		{"method": "addGasLine", "params":{"ID": "", "coords": , "interval": , "colour": }}
	'''
	LineTemplate = "{{\"method\": \"addGasLine\", \"params\":{{\"ID\":\"{}\", \"coords\": {}, \"interval\": {}, \"colour\":\"{}\"}}}}"

	jsonCoordsArray = getJsonCoordsArray(kmlString)
	interval = 75
	name = nameTags.findall(kmlString)[0]
	print(name, int(name))
	if int(name) == 0:
		colour = "#FF0000"
	else:
		colour = "#009900"

	jsonString = LineTemplate.format(uuid.uuid4(), jsonCoordsArray, interval, colour)
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

		jsonCoords += "{{\"lat\": {},\"lng\": {} }}".format(point[1],point[0])

	jsonCoords += "]"
	return jsonCoords

def getType(kmlString):
	"""
	Get the type of an icon
	Parameters
	----------
	kmlString : string
		A string in kml format
	Returns
	-------
	type : string
		A string representing the type of the icon
	"""
	style = typeTags.findall(kmlString)[0]
	type = TYPES.get(style, 'undefined')
	return type

if __name__ == "__main__":
	if len(sys.argv) != 2:
		print("One File Path argument required\n passed ", len(sys.argv)-1)
	else:
		jsonOutput = parseKml(sys.argv[1])
		with open("mapData.json", "w") as json_file:
				json_file.write(json.dumps(jsonOutput, indent=4, sort_keys=True))
		print("Output to mapData.json")
