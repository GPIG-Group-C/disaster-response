var http = require('http').createServer(handler); //require http server, and create server with function handler()
var io = require('socket.io')(http) // require socket.io module and pass the http object (server)

var nStatic = require('node-static'); // Allows access to static resources such as images and CSS
var fileServer = new nStatic.Server('./public');

http.listen(5000); //listen to port 5000

// Created server:
function handler (request, response)
{ 
	if(request.method === "GET")
	{
		fileServer.serve(request, response);
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

// WebSocket Connection
io.sockets.on('connection', function (socket) {
	var coords;
	socket.on('newMarker', function(data) {
		coords = data;
		if (coords != null)
		{
			console.log(coords);
			socket.broadcast.emit('addNewMarker', coords);    
		}
    });
});
