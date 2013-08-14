/* SERVER UTILITIES */
var CONF = require('./config/config.js'),
    express = require('express'),
	app = express(),
    routes = require('./routes'),
	server = require('http').createServer(app),
	io = require('socket.io').listen(server, { log: CONF.IO_LOG, origins: CONF.IO_ORIGINS }),
    util = require('./lib/adfabUtils'),
/* APPLICATION VARIABLES */
    allClients = [];

util.log("Configure Express framework\n");

/* Server */
app.configure(function ()
{
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.set("view options", {layout : true});
    app.use(express.logger());
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.static(__dirname + '/public'));
    app.use(app.router);
    app.use(function (req, res, next)
    {
        routes.err404(req, res);
    });
});

/* Listen to specific port */
server.listen(CONF.PORT);

/* Define default index router */
app.get('/', routes.index);

app.get('/maybe-baby', routes.maybe);
/* Define router for user who request a leaderboard */
app.get('/widget/:type/:roomID', routes.widget);

/* For now POST method is not in the MODEL part of the app logic because it use the socket and not the REST API */
app.post('/notification', function (req, res)
{
    var bodyRequest = req.body;
    for (var i in bodyRequest)
	{
		try{
			if(util.NotNull(JSON.parse(i).apiKey)){
				bodyRequest = JSON.parse(i);
			}
		}
		catch(e){}
	}
    
    res.header('Access-Control-Allow-Origin', '*'); // response with allowed access header
    if(!util.NotNull(bodyRequest.apiKey, "") && !util.NotNull(bodyRequest.userId, "") && !(bodyRequest.apiKey in allClients)) {
        res.send(bodyRequest.apiKey);
        res.end('');
        return;
    }
    
	if( util.NotNull(bodyRequest) &&
		util.NotNull(bodyRequest.html) &&
		util.NotNull(bodyRequest.apiKey) &&
		util.NotNull(bodyRequest.userId) &&
		util.NotNull(allClients[bodyRequest.apiKey])) { // If is enough to send notif
		
		var currentClient = null, othersClient = null;
	    for (var i=0; i < allClients[bodyRequest.apiKey].length; i++) {
			if(allClients[bodyRequest.apiKey][i].userId == bodyRequest.userId){
				currentClient = allClients[bodyRequest.apiKey][i];
			}
			else{
				
			}
	    };
	    
		switch(bodyRequest.who){
			case 'self':
				if(currentClient !== null)
					currentClient.emit('notification', bodyRequest);
			break;
			case 'others':
                if(currentClient !== null)
                    currentClient.broadcast.to(bodyRequest.apiKey).emit('notification', bodyRequest);
			break;
			case 'all':
				io.sockets.in(bodyRequest.apiKey).emit('notification', bodyRequest);
			break;
			default:break;
		}
	}
    
    var headers = {};
    headers["Access-Control-Allow-Origin"] = "*";
    headers["Access-Control-Allow-Methods"] = "POST, GET, PUT, DELETE, OPTIONS";
    headers["Access-Control-Allow-Credentials"] = true;
    headers["Access-Control-Max-Age"] = '86400'; // 24 hours
    headers["Access-Control-Allow-Headers"] = "X-Requested-With, Access-Control-Allow-Origin, X-HTTP-Method-Override, Content-Type, Authorization, Accept";
    res.writeHead(200, headers);
    res.end('');
});

util.log("Configure sockets.io");

/* a user connect to our I/O server */
io.sockets.on('connection', function (client)
{
	util.log("nouvelle utilisateur conncecté a un widget!\n"); // sortie console sur serveur
    
    // User request a widget
	client.on('widget', function (data) // data must contain
	{
        if(!util.NotNull(data.room, "")) return;
        
        // push user to the room Array ( and create hes room in the Array if it doesn't exist )
        if(!util.NotNull(allClients[data.room])) allClients[data.room] = [];
        allClients[data.room].push(client);
        
	    client.join(data.room); // Make the client user join the requested room
	    client.currentRoom = data.room; // Save hes room name so he know it
	    
	    // Request user from the leaderboard's room
        // User.getUsers(data.room, -1, function (userData)
        // {
            // if (userData.err) throw userData.err;
            // client.emit('update', userData); // send the leaderboard to the user who just connect
        // });
	});
	
	client.on('logged', function (data) // data must contain
	{
        if(!util.NotNull(data.room, "") || !util.NotNull(data.user, "")) return;
        // push user to the room Array ( and create hes room in the Array if it doesn't exist )
        if(!util.NotNull(allClients[data.room])) allClients[data.room] = [];
        allClients[data.room].push(client);
        
	    client.join(data.room); // Make the client user join the requested room
	    client.currentRoom = data.room; // Save hes room name so he know it
        client.userId = data.user;
	    //client.emit('notification', {test : 'test'});
	});
	
	// Listen for connection close to remove the user from the room he was
	client.on('disconnect', function ()
	{
        //io.sockets.in(client.currentRoom).emit('test'); // e: to broadcast stuff when a room user has left it
        if(util.NotNull(allClients[client.currentRoom]) && allClients[client.currentRoom].indexOf(client) >= 0)
            allClients[client.currentRoom] = allClients[client.currentRoom].slice( // Delete user from room visited
                allClients[client.currentRoom].indexOf(client)
                , 1
            );
    });
    
});

util.log("server started on port :" + CONF.PORT + "\n");

