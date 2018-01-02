const request_promise = require('request-promise');
const requestUrl = 'http://localhost';

async function crawlScenario(baseScenario){
	var baseScenarioActions = baseScenario.actions;
	var bid = baseScenario._id;

	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
		var newActions = await baseScenarioActions.slice(0, i + 1);
		var sce = {"actions" : newActions, "bid" : bid};
		await sendCrawlScenarioToRabbit(sce);
		
	}
}

function sendCrawlScenarioToRabbit(sce){
	request_promise({
		method: 'POST',
		uri: requestUrl + ':8091/crawlNow/',
		body: sce,
		json: true
	})
	.then(function (parsedBody) {
		// return Promise.resolve(parsedBody);
	})
	.catch(function (err) {
		console.log(err);
		// return Promise.reject(err);
	});
}

exports.crawlScenario = crawlScenario;