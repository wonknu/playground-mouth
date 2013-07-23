/**
 *  
 * @param {Object} opt
 */
var Users = function (opt)
{
    var self = this;
    this.opt = opt || {daddy : 'body'};
    this.dataUsers = null;
    this.container = $('<ul class="leaderboard"/>');
    
    $(this.opt.daddy).append('<di class="title">Leader board demo</div>');
    $(this.opt.daddy).append(this.container);
    
    this.init = function (data)
    {
        var lis = [];
        this.dataUsers = data;
        $.each(this.dataUsers, function (i, o)
        {
            lis.push($('<li/>', {
                "class" : "user",
                "html" : o.username + " earned " + o.points + " points! <span>[" + o.last_updt + "]</span>"
            }));
        });
        self.container.append(lis);
    };
    
    this.updtUser = function (data)
    {
        var _this = this, last = this.container.find('li:last-child');
        last.addClass('leave');
        setTimeout(function ()
        {
            // REMOVE
            var newLi = $('<li/>', {
                "class" : "user leave",
                "html" : data.username +
                        " earned " + data.points +
                        " points! <span>[" + new Date().toLocaleDateString() + ", " + new Date().toLocaleTimeString() + "]</span>"
            });
            last.remove();
            
            // ADD 
            _this.container.prepend(newLi);
            
            newLi.delay(1000).delay(1).queue(function()
            {
                $(this).removeClass('leave')
            });
            
        }, 1000);
    };
    
    return this;
};

function init ()
{
    var widgetRoomRequested = roomID;
    if(widgetRoomRequested == "") return;
    
    var socket = io.connect('http://localhost:8333/'),
        users = null;
    
    socket.on('connect', function ()
    {
        console.log('connect');
        // ask for the 10 last user in databases from a specifique room
    });
    
    
    socket.on('update', function (data)
    {
        // new data are retrieve -> update the html
        if( data == null || data == undefined ||
            ((data.users == null || data.users == undefined) &&
            (data.user == null || data.user == undefined))
        ) return;
        
        if(users == null) users = new Users();
        
        if(data.users) users.init(data.users);
        else users.updtUser(data.user);
        
    });
    
    socket.emit('widget', { room : widgetRoomRequested }); 
}

$(document).ready(function ()
{
    init();
}); 

