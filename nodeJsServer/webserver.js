var http = require('http').createServer(handler); //require http server, and create server with function handler()
var io = require('socket.io')(http) // require socket.io module and pass the http object (server)
var fs = require('fs'); //require filesystem module
var path = require('path'); // Get file extensions

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

// WebSocket broadcast data to all clients:
io.sockets.on('connection', function (socket) {
	socket.on('broadcastData', function(data) {
		console.log('Broadcasting...');
		console.log(data);
		socket.broadcast.emit('notification', data); 
    });
});
