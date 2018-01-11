const request = require('request');
const winston = require('winston');
var sleep = require('sleep');

const ScenarioCandidate = require('./src/SaveScenarioCandidate.js');
const LenLocation = require('./src/LenLocation.js').LenLocation;
const Step = require('./src/Step.js').Step;
const Noise = require('./src/Noise.js').Noise;
const Scenario = require('./src/Scenario.js').Scenario;
const sendScenarioRequests = require('./src/sendScenarioRequests.js');
// const ProCalculater = require('./src/ProCalculater.js').ProCalculater;

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
	await ScenarioCandidate.crawlCandidate(baseScenario);
	//naming helps to understand the code

	return Promise.resolve(baseScenario);
})
.then( async (baseScenario) => {

	await winston.info(`wait: crawler is crawling candidate actions`);
	await sleep.sleep(40);

	var step = new Step();
	await step.initialStep();
	await sleep.sleep(4);
	return Promise.resolve(baseScenario);		

})
.then( async (baseScenario) => {

	for (var i = 0; i < loopMax; i++) {

		var lengLocation = new LenLocation(baseScenario, safeSart);
		var location = await lengLocation.genLocation();
		await winston.info(`the random location array is : ${location}`);

		//find the insert noise actions
		var noise = new Noise(location.length);
		var insertStep = await noise.getAndChooseStep();

		//generate new scenarios
		var scenario = new Scenario(base_scenario, location, insertStep);
		var sidTF = await scenario.genTF();
		await sendScenarioRequests.sendScenarioRequests(sidTF);
		
		var sidIO = await scenario.genIO();
		await sendScenarioRequests.sendScenarioRequests(sidIO);

	}

});