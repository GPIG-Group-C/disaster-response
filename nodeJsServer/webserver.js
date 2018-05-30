var http = require('http').createServer(handler); //require http server, and create server with function handler()
var io = require('socket.io')(http) // require socket.io module and pass the http object (server)
var fs = require('fs'); //require filesystem module
var path = require('path'); // Get file extensions

var json_data = JSON.parse(fs.readFileSync(__dirname + '/mapData.json', 'utf8'));
var smart_1 = JSON.parse(fs.readFileSync(__dirname + '/smartAction_1.json', 'utf8'));
var smart_2 = JSON.parse(fs.readFileSync(__dirname + '/smartAction_2.json', 'utf8'));
var smart_3 = JSON.parse(fs.readFileSync(__dirname + '/smartAction_3.json', 'utf8'));

console.log("JSON Length: " + json_data.length);

http.listen(5000); //listen to port 5000

// Created server:
function handler (request, response)
{ 
	if(request.method === "GET")
	{
		var filePath = request.url;
		if (filePath == '/')
			filePath = '/index.html';

		var extname = path.extname(filePath);
		var contentType = 'text/html';
		switch (extname) {
			case '.js':
				contentType = 'text/javascript';
				break;
			case '.css':
				contentType = 'text/css';
				break;
			case '.json':
				contentType = 'application/json';
				break;
			case '.png':
				contentType = 'image/png';
				break;      
			case '.jpg':
				contentType = 'image/jpg';
				break;
			case '.svg':
				contentType = 'image/svg+xml';
				break;
			case '.wav':
				contentType = 'audio/wav';
				break;
		}

		fs.readFile(__dirname + '/public' + filePath, function(error, content) {
			response.writeHead(200, { 'Content-Type': contentType });
			return response.end(content, 'utf-8');
		});
	}
	else if(request.method === "POST")
	{
		var requestBody = '';
		request.on('data', function(data) {
			requestBody += data;
		});
		request.on('end', function() {
			var formData = JSON.parse(requestBody);
			console.log(formData);
			response.writeHead(200, {'Content-Type': 'text/html'});
			response.write('<!doctype html><html><head><title>Response</title></head>');
			response.end('<body>Data received</body></html>');
		});
	}
}

var connectCounter = 0;
io.sockets.on('connect', function() { connectCounter++; console.log("Clients: " + connectCounter); });
io.sockets.on('disconnect', function() { connectCounter--; console.log("Clients: " + connectCounter); });

var jsonIndex = 0;

// WebSocket broadcast data to all clients:
io.sockets.on('connection', function (socket) {
	
	socket.on('event', function(data) {
		console.log('recieved event');
		console.log(data);
		switch(data.method)
		{
			case "sendAll":
				console.log("sendAll");
				socket.broadcast.emit('notification', json_data);
				socket.broadcast.emit('notification', smart_1);
				socket.broadcast.emit('notification', smart_2);
				socket.broadcast.emit('notification', smart_3);
				break;
			case "sendData":
				console.log("sendData");
				socket.broadcast.emit('notification', json_data.slice(data.start, data.end));
				jsonIndex += 5;
				break;
			case "smartEvent":
				console.log("smartEvent");
				switch(data.eventNum)
				{
					case 1:
						socket.broadcast.emit('notification', smart_1);
						break;
					case 2:
						socket.broadcast.emit('notification', smart_2);
						break;
					case 3:
						socket.broadcast.emit('notification', smart_3);
						break;
				}	
				break;
		}
	});
	
	socket.on('broadcastData', function(data) {
		console.log('Broadcasting...');
		console.log(data);
		socket.broadcast.emit('notification', data); 
    });

});
