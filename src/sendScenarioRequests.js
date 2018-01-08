//input sidList, send them to scenario Player API
const winston = require('winston');
const request = require('request');
const sleep = require('sleep');

async function sendScenarioRequests(sidList) {

	for (var i = 0; i < sidList.length; i++) {
		await sleep.sleep(2);
		await request('http://localhost:8090/playNow/' + sidList[i], async (error, response, body) => {
			if (!error) {
				console.log("body" + body);							
			}
		});		
	}
}

module.exports.sendScenarioRequests = sendScenarioRequests;