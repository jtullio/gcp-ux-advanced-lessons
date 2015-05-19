// config/gcloud-config.js

if (!(process.env.GAE_LONG_APP_ID || process.env.DATASET_ID)) {
	throw new Error(
		'No project ID found. Please set an environment variable ' + "DATASET_ID" + ' with the ID of your project.'
	);
}

module.exports = {
	projectId: (process.env.GAE_LONG_APP_ID || process.env.DATASET_ID),
	keyFileName: 'key.json'
};


