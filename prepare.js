const request = require('request');
const winston = require('winston');
var sleep = require('sleep');

const ScenarioCandidate = require('./src/SaveScenarioCandidate.js');
const LenLocation = require('./src/LenLocation.js').LenLocation;
const Step = require('./src/Step.js').Step;
const Noise = require('./src/Noise.js').Noise;
const Scenario = require('./src/Scenario.js').Scenario;

const requestUrl = 'http://localhost';
const safeSart = 1;
const loopMax = 3;

var promise = new Promise(async (resolve, reject) => {

	request.get(requestUrl + ':8086/base/', (error, response, body) => {
		if (!error) {
			var baseScenarioArray = JSON.parse(body);
			var baseScenario = baseScenarioArray[baseScenarioArray.length-1];							
			resolve(baseScenario);
		} else {
			reject(error);
		}
	});

});

promise.then( async (baseScenario) => {
	var baseScenarioActions = baseScenario.actions;
	await ScenarioCandidate.saveBaseActions(baseScenarioActions);
	var crawlScenarios = await ScenarioCandidate.genCrawlScenarios(baseScenario);
	await ScenarioCandidate.postToCrawl(crawlScenarios);
	// await ScenarioCandidate.crawlCandidate(baseScenario);
})
.then( async () => {
	
	await winston.info(`thank you for waiting crawler crawling candidate actions`);
	
	var step = new Step();
	await step.initialStep();	

});