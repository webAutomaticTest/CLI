const wat_action = require('wat_action_nightmare');
const request = require('request');
const amqp = require('amqplib');
const argv = require('yargs').argv;
const winston = require('winston');

const saveBaseActions = require('./src/saveBaseActions.js');

// const QUEUE_NAME = 'crawl_candidate_queue';
// const serverNames = {
// 	mongoServerName: argv.mongo,
// 	rabbitServerName : argv.rabbit
// }
// const rmqUrl = `amqp://${serverNames.rabbitServerName}`;

getBaseScenario.call(this);

function getBaseScenario(){

	request.get('http://localhost:8086/base/', function (error, response, body) {
	if (!error) {
		
		// console.log("bodytype:" + typeof(body));
		var baseScenario = JSON.parse(body);		
		var baseScenarioActions = baseScenario[baseScenario.length-1].actions;

		//save actions
		saveBaseActions.saveBaseActions(baseScenarioActions);

		//generate cnadidates

		// var baseJSON = JSON.parse(body);
		// console.log("baseLen:"+ baseScenario.length);
		// console.log("basescenarioID:"+ baseScenario[baseScenario.length-1]._id);
		// console.log("basescenarioAction:"+ baseScenario[baseScenario.length-1].actions);
		
		// var baseScenarioString = new wat_action.Scenario();
		// const scenario_base = new wat_action.Scenario(baseScenarioString);

		// base_scenario_get.actions = baseScenario[baseScenario.length-1].actions;
		// console.log(base_scenario_get);

		// console.log(baseScenarioActions);


		// splitBaseScenario(baseScenarioActions);
		toCrawlCandidates(baseScenarioActions);


	}
	});

}

function toCrawlCandidates(baseScenarioActions){
	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
		// var newActions = baseScenarioActions.slice(0, i + 1);
		// var scenario = new wat_action.Scenario();

		// scenario.actions = newActions;
		// scenario.wait = 1000;
		
		request.get('http://localhost:8091/crawlNow/'+baseScenarioActions.slice(0, i + 1) , function (error, response, body) {
			console.log("crawlNow done");
		});
	}
}



// function toCrawlCandidates(baseScenarioActions){
	
		

// 		for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
// 			// var baseScenario = baseScenarioActions;
// 			// var newActions = baseScenario.slice(0, i + 1);

			
// 			// console.log(newActions);
// 			// console.log("====================");

// 			var firstPromise = baseScenarioActions.slice(0, i + 1);

// 			var secondPromise = amqp.connect(rmqUrl)
// 			.then( conn => {
// 				return conn.createConfirmChannel();
// 			})
// 			.catch( e=> {
// 				return Promise.reject(e);
// 			});

// 			Promise.all([firstPromise,secondPromise])
// 			.then(promizesResults => {
// 				// winston.info('Play Now Request ');
// 				// console.log(promizesResults[0]);

// 				// var scenarioToCrawl = new wat_action.Scenario();

// 				var scenarioToCrawl = promizesResults[0];
// 				// scenarioToCrawl.wait = 1000;//wait after each action
// 				// scenario.actions = newActions;
// 				var msg = JSON.stringify(scenarioToCrawl);
// 				winston.info(msg);

// 				var channel = promizesResults[1];
// 				channel.assertQueue(QUEUE_NAME, { durable: true })
// 				.then(ok => {
// 					if (ok) {
// 						return channel.sendToQueue(QUEUE_NAME, Buffer.from(msg), {persistent: true});
// 					} else {
// 						return Promise.reject(ok);
// 					}
// 				})
// 				.then(() => {
// 					channel.close();
// 				})
// 				.catch ((err) =>{
// 					channel.close();
// 					winston.error(err);
// 				});


// 			})
// 			.catch(err => {
// 				console.log(err);
// 			});



// 		}

// 		// var scenarioToPlay = promizesResults[0][0];
// 		// var channel = promizesResults[1];
// 		// var msg = JSON.stringify(scenarioToPlay);
// 		// winston.info(msg);
// 		// channel.assertQueue(QUEUE_NAME, { durable: true })
// 		// .then(ok => {
// 		// 	if (ok) {
// 		// 		return channel.sendToQueue(QUEUE_NAME, Buffer.from(msg), {persistent: true});
// 		// 	} else {
// 		// 		return Promise.reject(ok);
// 		// 	}
// 		// })
// 		// .then(() => {
// 		// 	channel.close();
// 		// })
// 		// .catch ((err) =>{
// 		// 	channel.close();
// 		// 	winston.error(err);
// 		// });

// }



// function splitBaseScenario(baseScenarioActions){
// 	for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
// 		// baseScenarioActions[i]
// 		var baseScenario = baseScenarioActions;
// 		var scenarioToCrawl = baseScenario.slice(0, i + 1);
// 		console.log(scenarioToCrawl);
// 		console.log("====================")
// 		// var msg = JSON.stringify(scenarioToCrawl);
// 		// return Promise.resolve(scenarioToCrawl);
// 	}

// }