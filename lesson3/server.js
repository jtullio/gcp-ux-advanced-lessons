var appengine = require('appengine');
var express = require('express');
var bodyParser = require('body-parser');
var appengine = require('appengine');

var matrix = require('./app/decisionmatrix.js');

var app = module.exports.app = express();
var api = module.exports.api = express();
api.use(bodyParser.json());

var CURRENT_MATRIX = 'default-matrix';

// Include the experimental GAE Node.js libraries
// See https://github.com/GoogleCloudPlatform/appengine-nodejs
// app.use(appengine.middleware.base);

// Tell express where we're serving our static files from
app.use(express.static(__dirname + '/static'));

//
// Routes we will need to support GAE's requirements for a custom runtime.
//

// Health check:
app.get('/_ah/health', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
});

// App start. The application may use this to signal that GAE expects your 
// container to be ready to respond to incoming traffic.
/*
app.get('/_ah/start', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
});

// App stop. Use to perform any necessary clean up before the container is shut down.
app.get('/_ah/stop', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.status(200).send('ok');
  process.exit();
});
*/
//
// Matrix API
//

// API Routes.
api.get('/', function(req, res) {
  res.status(200)
    .set('Content-Type', 'text/plain')
    .send('ok');
});

// Get all entries 
api.get('/api/matrix', function(req, res) {
	console.log("getall() starting");
	matrix.getAll(handleAPIResponse(res, 201));
}); 

// Get a selected entry by id
api.get('/api/matrix/:item_id', function(req, res) {
	matrix.get(req.param('item_id'), handleAPIResponse(res));
});

// Create new entry, send back all entries after complete. 
api.post('/api/matrix', function(req, res) {
	matrix.insert(req.body, handleAPIResponse(res, 201));
});

// delete an item
api.delete('/api/matrix/:item_id', function(req, res) {
	matrix.delete(req.params.item_id, handleAPIResponse(res));
});

function handleAPIResponse(res, successStatus) {
console.log("handleAPIResponse" + successStatus);
	return function(err, payload) {
		if (err) {
			console.error(err);
			res.status(err.code).send(err.message);
			return;
		}
		if (successStatus) {
			res.status(successStatus);
		}
		res.json(payload);
	};
}

api.listen(8080);
//console.log('Listening on port 8080');
