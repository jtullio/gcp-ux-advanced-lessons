// var appengine = require('appengine');
var express = require('express');
var bodyParser = require('body-parser');

var matrix = require('./decisionmatrix.js');
var gconfig = require('./config/gcloud-config');

var app = express();

// Set up gcloud libraries so we can access service through node.
// See: http://googlecloudplatform.github.io/gcloud-node/
process.stdout.write("Setting up gcloud...");
var gcloud = require('gcloud')( {
	projectId: gconfig.projectId,
	keyFileName: gconfig.keyFileName
});
console.log("done.");

// Use the gcloud node library to instantiate a connection to our datastore.
process.stdout.write("Setting up datastore...");
var datastore = gcloud.datastore.dataset();
console.log("done.");

// Include the experimental GAE Node.js libraries
// See https://github.com/GoogleCloudPlatform/appengine-nodejs
// app.use(appengine.middleware.base);

//
// Routes we will need to support GAE's requirements for a custom runtime.
//

// Health check:
app.get('/_ah/health', function(req, res) {
  res.set('Content-Type', 'text/plain');
  res.send(200, 'ok');
});

// App start. The application may use this to signal that GAE expects your 
// container to be ready to respond to incoming traffic.
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

//
// Matrix API
//

// Get all entries 
app.get('/api/matrix', function(req, res) {
	matrix.getAll(function(err, entries) {
		if (err) {
			console.log("error on getall");
			res.send(err) // Nothing after this will execute
		} 

		res.json(entries); // Return entries as JSON
		console.log("error on getall");
	}); 
});

// Create new entry, send back all entries after complete. 
app.post('/api/todos', function(req, res) {
	// create a todo, information comes from AJAX request from Angular 
	matrix.insert({
            text : req.body.text,
            done : false
        }, function(err, todo) {
            if (err)
                res.send(err);

            // get and return all the todos after you create another
            Todo.find(function(err, todos) {
                if (err)
                    res.send(err)
                res.json(todos);
            });
        });

});

// delete a todo
app.delete('/api/todos/:todo_id', function(req, res) {
    Todo.remove({
        _id : req.params.todo_id
    }, function(err, todo) {
        if (err)
            res.send(err);
         // get and return all the todos after you create another
        Todo.find(function(err, todos) {
            if (err)
                res.send(err)
            res.json(todos);
        });
    });
});

app.listen(8080, '0.0.0.0');
console.log('Listening on port 8080');
