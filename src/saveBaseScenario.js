const request_promise = require('request-promise');

// const scenario_str = require('./baseScenario/baseScenario.json');
// const wat_action = require('wat_action_nightmare');
// const base_scenario = new wat_action.Scenario(scenario_str);
// const baseScenarioJson = JSON.parse(base_scenario.toJSON());

// saveBaseScenario(baseScenarioJson);

function saveBaseScenario(baseScenarioJson){
	request_promise({
		method: 'POST',
		uri: 'http://localhost:8086/base/',
		body: baseScenarioJson,
		json: true
	})
    .then(function (parsedBody) {// POST succeeded...
    	console.log(parsedBody);
    })
    .catch(function (err) {// POST failed...
    	console.log(err);
    });
}

module.exports.saveBaseScenario = saveBaseScenario;