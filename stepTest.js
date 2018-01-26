const request = require('request');
const request_promise = require('request-promise');
const winston = require('winston');

const requestUrl = 'http://localhost';

// async function initialStep(){
// 	request.get(requestUrl + ':8086/candidate/', async (error, response, body) => {
// 		if (!error) {
// 			var candidates = JSON.parse(body);
// 			console.log(candidates.length);
// 			for (var i = 0; i < candidates.length; i++) {
// 				candidates[i].probability = await 1 / candidates.length;
// 				await request_promise({
// 					method: 'POST',
// 					uri: requestUrl + ':8086/init_step/',
// 					body: candidates[i],
// 					json: true
// 				})
// 				.then(function (parsedBody) {						
// 					return Promise.resolve(parsedBody);
// 				})
// 				.catch(function (err) {
// 					winston.info(`InitialStep to post action is error : ${err}`);
// 				});					
// 			}

// 		} else {
// 			winston.info(`InitialStep to request all the actions is error : ${error}`);
// 		}
// 	});
// }

const InitialSteps = require('./src/InitialSteps.js').InitialSteps;

async function initialStep(){
	var initialSteps = new InitialSteps();
	await initialSteps.initialSteps();
}

initialStep();