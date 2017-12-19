const wat_action = require('wat_action_nightmare');
const request = require('request');
const amqp = require('amqplib');
const argv = require('yargs').argv;
const winston = require('winston');
const requestUrl = 'http://localhost';

const saveBaseActions = require('./src/saveBaseActions.js');
const saveCrawlScenario = require('./src/saveCrawlScenario.js');

getBaseScenario.call(this);

function getBaseScenario(){

	request.get(requestUrl + ':8086/base/', function (error, response, body) {
		if (!error) {

			var baseScenario = JSON.parse(body);		
			var baseScenarioActions = baseScenario[baseScenario.length-1].actions;

			saveBaseActions.saveBaseActions(baseScenarioActions);

			saveCrawlScenario.saveCrawlScenario(baseScenario[baseScenario.length-1]);


			request.get(requestUrl + ':8086/crawlScenario/', function(error, response, body) {
				var crawlScenarios = JSON.parse(body);
				for (var i = 0; i <= crawlScenarios.length - 1; i++) {
					console.log(crawlScenarios[i]._id);
					request.get(requestUrl + ':8091/crawlNow/' + crawlScenarios[i]._id, function(error, response, body) {
						console.log(body);

					});
				}
			});

		}
	});

}

