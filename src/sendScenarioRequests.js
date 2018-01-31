//input sidList, send them to scenario Player API
const winston = require('winston');
const request = require('request');
const sleep = require('sleep');
const Step = require('./Step.js').Step;

async function requestPlayScenario(sid){

	return new Promise(async (resolve, reject) => {

		await request.get('http://localhost:8091/playNow/' + sid, async (error, response, body) => {
			if (!error) {
				await console.log("body: " + body);
				if (body=='notUnableFindErr'){
					console.log('some err we can not identify');
					resolve(null);
				} else {
					var tempInfo = JSON.parse(body);
					console.log('tempInfo body value json format is :');
					console.log(tempInfo);
					resolve(tempInfo);
				}
				
											
			} else {
				reject(error);
			}
		});	

	});	
}

async function sendScenarioRequest(sid) {
	if (sid.length === 1){
		let updateStepInfo = await requestPlayScenario(sid);		
		await console.log("respose is :");
		await console.log(updateStepInfo);
		return updateStepInfo;
	}		
}

async function sendScenarioRequests(sidList) {

	var feedbackStepInfoArray = [];

	for (var i = 0; i < sidList.length; i++) {
		var updateStepInfo = await requestPlayScenario(sidList[i]);
		await feedbackStepInfoArray.push(updateStepInfo);		
		await console.log("respose is :");
		await console.log(updateStepInfo);
	}

	return feedbackStepInfoArray;
}

module.exports.sendScenarioRequest = sendScenarioRequest;
module.exports.requestPlayScenario = requestPlayScenario;
module.exports.sendScenarioRequests = sendScenarioRequests;
