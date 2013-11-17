var Admin = {
	init : function (roomRequested)
	{
	    if(roomRequested == "") return;
	    
	    var socket = io.connect('http://localhost:88/');
	    
	    socket.on('connect', function ()
	    {
	        console.log('connect');
	        $('.container').html(
				'<ul>' +
					'<li class="count-user">nombre d\'utilisateur connecté : <span></span></li>' +
				'</ul>'
			);
	    });
	    
	    
	    socket.on('update', function (data)
	    {
	        console.log(data);
	        $('.count-user span').text(data.connected);
	    });
	    
	    socket.emit('watch', { room : roomRequested }); 
	}
};

$(document).ready(function ()
{
    $('.load-room').on('click', function ()
    {
    	var val = $('.room').val();
    	if(val == "") return;
    	Admin.init(val);
    });
});
