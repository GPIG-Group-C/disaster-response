var http = require('http').createServer(handler); //require http server, and create server with function handler()
var fs = require('fs'); //require filesystem module
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
		
		/*
		if(request.url.includes("css"))
		{
			fs.readFile(__dirname + '/public/' + request.url,function(err,data){
                response.writeHead(200,{"Content-Type": "text/css"});
                response.write(data);
                response.end();
                });
		}
		else
		{
			//read file index.html in public folder
			fs.readFile(__dirname + '/public/index.html', function(err, data) { 
				if(err)
				{
					response.writeHead(404, {'Content-Type': 'text/html'}); //display 404 on error
					return response.end("404 Not Found");
				} 
				response.writeHead(200, {'Content-Type': 'text/html'}); //write HTML
				response.write(data); //write data from index.html
				return response.end();
			});
		}
		*/
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
			response.write('<!doctype html><html><head><title>Response</title></head><body>');
			response.write('Thanks for the data!');
			response.end('</body></html>');
		});
	}
}

// WebSocket Connection
io.sockets.on('connection', function (socket) {
	
    var lightvalue = 0;
	// Get checkbox status from client:
	socket.on('light', function(data) {
		lightvalue = data;
		if (lightvalue != null)
		{
			console.log(lightvalue);
			io.sockets.emit('light_2', lightvalue);    
		}
    });
	
	var message = "";
	socket.on('message', function(data) {
		message = data;
		if (message != null)
		{
			console.log(message);
			io.sockets.emit('message_print', lightvalue);    
		}
    });
	
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
