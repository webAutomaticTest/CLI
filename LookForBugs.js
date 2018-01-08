const request = require('request');
const winston = require('winston');

const LenLocation = require('./src/LenLocation.js').LenLocation;
const Step = require('./src/Step.js').Step;
const Noise = require('./src/Noise.js').Noise;
const Scenario = require('./src/Scenario.js').Scenario;
const ScenarioJS = require('./src/Scenario.js');
const sendScenarioRequests = require('./src/sendScenarioRequests.js');

const requestUrl = 'http://localhost';
const safeSart = 0;
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

	var base_scenario = baseScenario;

	// var step = new Step();
	// await step.updateStep();	

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