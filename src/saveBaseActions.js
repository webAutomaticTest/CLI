const request = require('request');
const Promise = require('promise');
const request_promise = require('request-promise');

function saveBaseActions(baseScenarioActions){//input baseScenarionActions and save all the actions to mongodb table action
	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
		saveOneBaseAction(baseScenarioActions[i]);
	}
	// return Promise.resolve();
}

function saveOneBaseAction(baseActionJson){
	request_promise({
		method: 'POST',
		uri: 'http://localhost:8086/action/',
		body: baseActionJson,
		json: true
	})
    .then(function (parsedBody) {// POST succeeded...
    	return Promise.resolve(parsedBody);
    })
    .catch(function (err) {// POST failed...
    	console.log(err);
    	return Promise.reject(err);
    });
}

exports.saveBaseActions = saveBaseActions;