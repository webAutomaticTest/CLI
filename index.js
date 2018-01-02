const wat_action = require('wat_action_nightmare');
const request = require('request');

const ScenarioCandidate = require('./src/SaveScenarioCandidate.js');
const scenario_str = require('./baseScenario/baseScenario.json');
const base_scenario = new wat_action.Scenario(scenario_str);
const baseScenarioJson = JSON.parse(base_scenario.toJSON());

const requestUrl = 'http://localhost';

var promise = new Promise(async (resolve, reject) => {

	var bid = await ScenarioCandidate.saveBaseScenario(baseScenarioJson);

	if(bid){
		request.get(requestUrl + ':8086/base/' + bid, (error, response, body) => {
			if (!error) {
				var baseScenarioArray = JSON.parse(body);
				if(1 === baseScenarioArray.length){
					var baseScenario = baseScenarioArray[baseScenarioArray.length-1];							
					resolve(baseScenario);
				} else {
					reject('not one baseScenario');
				}
			} else {
				reject(error);
			}
		});

	} else {
		reject(error);
	}

});

promise.then( async (baseScenario) => {
	var baseScenarioActions = baseScenario.actions;
	await ScenarioCandidate.saveBaseActions(baseScenarioActions);
	await ScenarioCandidate.crawlCandidate(baseScenario);
})