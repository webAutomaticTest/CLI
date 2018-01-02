const request_promise = require('request-promise');

async function saveBaseActions(baseScenarioActions){//input baseScenarionActions and save all the actions to mongodb table action
	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
		await request_promise({
			method: 'POST',
			uri: 'http://localhost:8086/action/',
			body: baseScenarioActions[i],
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
}
module.exports.saveBaseActions = saveBaseActions;