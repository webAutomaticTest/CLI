const request = require('request');
const winston = require('winston');
const arrayShuffle = require('array-shuffle');

const requestUrl = 'http://localhost';

class Noise{

	constructor(noiseNum){
		this.noiseNum = noiseNum;
	}

	//input increaseLength of scenario === the number of noise action === num of location
	//get all the stepActions from mongo
	//choose the steps by probability value from high to low
	async getAndChooseStep(){

		var promise = new Promise(async (resolve, reject) => {
			request.get(requestUrl + ':8086/step/', async (error, response, body) => {
				if (!error) {
					var steps = await JSON.parse(body);
					var tempList = await arrayShuffle(steps).sort(this.compare).splice(0, this.noiseNum);
					var chosenStep = await arrayShuffle(tempList);
					resolve(chosenStep);
				} else {
					winston.info(`getAndChooseSteps to request.get all the steps is error : ${error}`);
					reject(error);
				}
			});
		});

		return promise;
	}

	// sort by probability value from high to low
	compare(a, b) {
		return b.probability - a.probability;
	};

}

module.exports.Noise = Noise;