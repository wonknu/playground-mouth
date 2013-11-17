/*
 * Route to the index.html when method GET
 */



/**
 * Default router 
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.index = function (req, res)
{
    res.render('error/401', { title: '401', msg: 'Permission issue to see this page' });
};

/**
 * Default router, handle unknow route
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.err404 = function (req, res)
{
    res.render('error/404', { title: '404', msg: 'File not found' })
};

/**
 * Test if the server is alive or dead
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.maybe = function (req, res)
{
    var body = 'Alive baby!';
    res.header('Access-Control-Allow-Origin', '*');
	res.setHeader('Content-Type', 'text/plain');
	res.setHeader('Content-Length', body.length);
	res.end(body);
};

/**
 * LeaderBoard router 
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.connection = function (req, res)
{
    if(req.params.roomID)
        res.render('index' + req.params.type , {
            title: req.params.roomID + "'s " + req.params.type,
            roomID : req.params.roomID
        });
};

/**
 * Default router 
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.admin = function (req, res)
{
    //if(req.params.roomID)
        res.render('admin', {
            roomID : req.params.roomID
        });
};

/**
 * LeaderBoard router 
 * @param {Object} req, express auto send this param
 * @param {Object} res, express auto send this param
 */
exports.widget = function (req, res)
{
    if(req.params.type && req.params.roomID)
        res.render('widget/' + req.params.type , {
            title: req.params.roomID + "'s " + req.params.type,
            roomID : req.params.roomID
        });
};
