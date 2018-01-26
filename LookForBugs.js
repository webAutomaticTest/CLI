const request = require('request');
const winston = require('winston');
const argv = require('yargs').argv;

const LenLocation = require('./src/LenLocation.js').LenLocation;
const Step = require('./src/Step.js').Step;
const Noise = require('./src/Noise.js').Noise;
const Scenario = require('./src/Scenario.js').Scenario;
const ScenarioJS = require('./src/Scenario.js');
const sendScenarioRequests = require('./src/sendScenarioRequests.js');

const requestUrl = 'http://localhost';
const safeSart = argv.safeSart;

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

promise.then( (baseScenario) => {
	mainLookForBugs(baseScenario);
});

async function mainLookForBugs(baseScenario){
	// console.log(safeSart);

	for (var i = 0; i < loopMax; i++) {

		console.log('=============='+i +'==============');
		var lengLocation = new LenLocation(baseScenario, safeSart);
		var locations = await lengLocation.genLocation();
		await winston.info(`the random locations array is : ${locations}`);

		//find the insert noise actions
		var noise = new Noise(baseScenario,locations);
		var stepNoises = await noise.getOneStepEachLocation();
		
		console.log(stepNoises);

		//generate new scenarios
		var scenario = new Scenario(baseScenario, locations, stepNoises);
		var sid = await scenario.genAndSaveScenario();
		await console.log('sid is : '+sid);

		// var feedbackStepInfoArray = await sendScenarioRequests.sendScenarioRequests(sid);
		// await updateSteps(feedbackStepInfoArray);
		
		var feedbackStepInfo = await sendScenarioRequests.requestPlayScenario(sid);
		await console.log(feedbackStepInfo);

		await updateStep(feedbackStepInfo);

	}

}

async function updateStep(feedbackStepInfo){
	if(feedbackStepInfo.length === 1) {
		var step = new Step(feedbackStepInfo);
		await step.updateStep();
	}
}

// async function updateSteps(feedbackStepInfoArray){
// 	for (var i = 0; i < feedbackStepInfoArray.length; i++) {
// 		if(feedbackStepInfoArray[i]) {
// 			var step = new Step(feedbackStepInfoArray[i]);
// 			await step.updateStep();
// 		}
// 	}

// }

