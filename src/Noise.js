const request = require('request');
const winston = require('winston');
const arrayShuffle = require('array-shuffle');

const requestUrl = 'http://localhost';

class Noise{

	constructor(baseScenario,locations){
		this.baseScenario = baseScenario;
		this.locations = locations;
		this.stepNoises = [];
	}

	// sort by probability value from high to low
	compare(a, b) {
		return b.probability - a.probability;
	};

	//input baseScenario and locations, 
	//for each location, search all candidates and choose one according probability
	async getOneStepEachLocation(){
		await console.log('begin to find the step Noises');
		for (var i = 0; i < this.locations.length; i++) {			
			var reqParams = {preIndex: this.locations[i], bid: this.baseScenario._id};
			var stepResult = await this.requestGetSteps(reqParams);
			await this.stepNoises.push(stepResult);			
		}
		return this.stepNoises;
	}

	async requestGetSteps(reqParams){
		return new Promise(async (resolve, reject) => {
			var options = {  
				url: requestUrl + ':8086/step/preIndex/',
				body: reqParams,
				method: 'GET',
				json:true
			};
			await request.get(options, async (error, response, body) => {
				if (!error) {
					var tempList = await arrayShuffle(body).sort(this.compare);					
					resolve(tempList[0]);
				} else {
					reject(error);
				}
			});
		});
	}

	//input increaseLength of scenario === the number of noise action === num of locations
	//get all the stepActions from mongo
	//choose the steps by probability value from high to low
	async getAndChooseStep(){
		return new Promise(async (resolve, reject) => {
			request.get(requestUrl + ':8086/step/', async (error, response, body) => {
				if (!error) {
					var steps = await JSON.parse(body);
					var tempList = await arrayShuffle(steps).sort(this.compare).splice(0, this.locations.length);
					var chosenStep = await arrayShuffle(tempList);
					resolve(chosenStep);
				} else {
					winston.info(`getAndChooseSteps to request.get all the steps is error : ${error}`);
					reject(error);
				}
			});
		});
	}

}

module.exports.Noise = Noise;