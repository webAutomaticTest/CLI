const request_promise = require('request-promise');
const winston = require('winston');
const wat_action = require('wat_action_nightmare');
const actionFactory = require('wat_action_nightmare').ActionFactory;
const ObjectID = require('mongodb').ObjectID;
const requestUrl = 'http://localhost';

class Scenario{
	constructor(base_scenario, location, stepNoises){
		this.base_scenario = base_scenario;
		this.location = location;
		this.stepNoises = stepNoises;
	}

	async genAndSaveScenario(){
		var noiseScenario = await this.genScenarios();
		var sid = await this.sendRequestToSaveScenario(noiseScenario);		
		return sid;
	}

	async genScenarios(){
		var scenario = new wat_action.Scenario(this.base_scenario.actions);
		var noiseInfo = [];
		for (var i = 0; i < this.stepNoises.length; i++) {
			var insert = actionFactory.createAction(this.stepNoises[i].action);			
			await scenario.actions.splice(this.stepNoises[i].preIndex + 1 + i , 0, insert);
			await noiseInfo.push({
				'stepId' : new ObjectID(this.stepNoises[i]._id),
				'action' : this.stepNoises[i].action,
				'preIndex' : this.stepNoises[i].preIndex
			});				
		}

		var noiseScenario = {
			"bid" : new ObjectID(this.base_scenario._id),
			"baseActions" : this.base_scenario.actions,
			"noiseInfo" : noiseInfo,
			"wait" : 1000,
			"actions" : scenario.actions,
			"cssselector" : 'watId',
			"name" : 'MyScenario',
			"assert" : {
				end: true,
				selector: 'body',
				property: 'innerHTML',
				contains: 'success'
			}
		}
		return noiseScenario;				
	}

	async sendRequestToSaveScenario(scenario){
		return request_promise({
			method: 'POST',
			uri: requestUrl + ':8086/scenario/',
			body: scenario,
			json: true
		})
		.then(function (parsedBody) {
			var sid = parsedBody.insertedIds;
			return Promise.resolve(sid);
		})
		.catch(function (err) {
			winston.info(`sendRequestToSaveScenario to post scenario is error : ${err}`);
		});
	}	

}

module.exports.Scenario = Scenario;