//input sidList, send them to scenario Player API
const winston = require('winston');
const request = require('request');
const sleep = require('sleep');

async function sendScenarioRequests(sidList) {

	for (var i = 0; i < sidList.length; i++) {
		var res = await requestPlayScenario(sidList[i]);		
		await console.log("respose is :" + res);

	}
}

async function requestPlayScenario(sid){

	var promise = new Promise(async (resolve, reject) => {

		await request.get('http://localhost:8091/playNow/' + sid, async (error, response, body) => {
			if (!error) {
				console.log("body: " + body);
				resolve(body);							
			} else {
				reject(error);
			}
		});	

	});

	return promise;
	
}



module.exports.sendScenarioRequests = sendScenarioRequests;