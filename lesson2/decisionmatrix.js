'use strict';

var CURRENT_MATRIX = 'default-matrix';

var projectId = process.env.GAE_LONG_APP_ID || process.env.DATASET_ID;
if (!projectId) {
	throw new Error(
		'No project ID found. Please set an environment variable ' + "DATASET_ID" + ' with the ID of your project.'
	);
};

var gcloud = require('gcloud') ({
	projectId: projectId,
	credentials: require('./key.json')
});

// Set up gcloud libraries so we can access service through node.
// See: http://googlecloudplatform.github.io/gcloud-node/
process.stdout.write("Setting up datastore...");
var datastore = gcloud.datastore.dataset();
console.log("done.");

function entityToItem(entity) {
  var item = entity.data;
  item.id = entity.key.path.pop();
  return item;
}

// Functions this module supports. Standard CRUD items.
module.exports = {
	delete: function(id, callback) {
		datastore.delete(
			datastore.key(['DecisionMatrix', CURRENT_MATRIX, 'Item', id]),
			function(err) { 
				callback(err || null);
			}
		);
	},

	get: function(id, callback) {
		datastore.get(
			datastore.key(['DecisionMatrix', CURRENT_MATRIX, 'Item', id]),
			function (err, item) {
				if (err) {
					callback(err);
					return;
				}
				if (!item) {
					callback({
						code: 404,
						message: 'No item with id ' + id + ' was found.'
					});
					return;
				}
				callback(null, entityToItem(item));
			}
		);
	},

	getAll: function(callback) {
		var key = datastore.key(['DecisionMatrix', CURRENT_MATRIX]);
		var query = datastore.createQuery('Item').hasAncestor(key);
		datastore.runQuery(query, function(err, items) {
			if (err) {
				callback(err);
				return;
			}
			callback(null, items.map(entityToItem));
		});
	},

	insert: function(data, callback) {
		data.completed = false; 
		datastore.save({
			key: datastore.key(['DecisionMatrix', CURRENT_MATRIX, 'Item']), 
			data: data 
		}, function(err, key) {
				if (err) {
					callback(err); 
					return; 
				} 
				data.id = key.path.pop(); 
				callback(null, data); 
			});
	},

	update: function(id, data, callback) {
		datastore.save({
			key: datastore.key(['DecisionMatrix', CURRENT_MATRIX, 'Item', id]), 
			data: data 
		}, function(err) {
			if (err) {
				callback(err); 
				return; 
			} 
			data.id = id; 
			callback(null, data); 
		}); 
	}
};
