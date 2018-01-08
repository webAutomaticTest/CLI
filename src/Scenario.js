const request_promise = require('request-promise');
const winston = require('winston');
const wat_action = require('wat_action_nightmare');
const requestUrl = 'http://localhost';

class Scenario{
	constructor(base_scenario, location, insertStep){
		this.base_scenario = base_scenario;
		this.location = location;
		this.insertStep = insertStep;
	}

	async genTF(){

		var scenarioTF = [];
		var sidTF = [];

		for (var i = 0; i < this.location.length; i++) {

			var scenario = new wat_action.Scenario(this.base_scenario.actions);
			await scenario.actions.splice(this.location[i] + 1, 0, this.insertStep[i].action);
			var cutAction = await scenario.actions.slice(0, this.location[i] + 2);
			
			var noiseScenario = {
				"abid" : this.location[i],
				"aid" : this.insertStep[i].aid,
				"flag" : "TF",
				"wait" : 1000,
				"actions" : cutAction,
				"cssselector" : 'watId',
				"name" : 'MyScenario',
				"assert" : {
					end: true,
					selector: 'body',
					property: 'innerHTML',
					contains: 'success'
				}
			}

			await scenarioTF.push(noiseScenario);		

		}

		await request_promise({
				method: 'POST',
				uri: requestUrl + ':8086/scenario/',
				body: scenarioTF,
				json: true
			})
			.then(function (parsedBody) {
				sidTF = parsedBody.insertedIds;				
			})
			.catch(function (err) {
				winston.info(`genTF to post scenario is error : ${err}`);
			});

		return Promise.resolve(sidTF);		
		
	}

	async genIO(){

		var scenarioList = [];
		var sids = [];

		for (var i = 0; i < this.location.length; i++) {

			var scenario = new wat_action.Scenario(this.base_scenario.actions);
			await scenario.actions.splice(this.location[i] + 1, 0, this.insertStep[i].action);
			var cutAction = await scenario.actions.slice(0, this.location[i] + 3);
			
			var noiseScenario = {
				"abid" : this.location[i],
				"aid" : this.insertStep[i].aid,
				"flag" : "IO",
				"wait" : 1000,
				"actions" : cutAction,
				"cssselector" : 'watId',
				"name" : 'MyScenario',
				"assert" : {
					end: true,
					selector: 'body',
					property: 'innerHTML',
					contains: 'success'
				}
			}

			await scenarioList.push(noiseScenario);		

		}

		await request_promise({
				method: 'POST',
				uri: requestUrl + ':8086/scenario/',
				body: scenarioList,
				json: true
			})
			.then(function (parsedBody) {
				sids = parsedBody.insertedIds;				
			})
			.catch(function (err) {
				winston.info(`genTF to post scenario is error : ${err}`);
			});

		return Promise.resolve(sids);		
		
	}

}

module.exports.Scenario = Scenario;