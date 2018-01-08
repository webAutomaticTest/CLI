//inuput base Scenario output the increase length and location.
const numberArrayGenerator = require('number-array-generator');
const Combinatorics = require('js-combinatorics');
const winston = require('winston');

class LenLocation{
	constructor(baseScenario, safeStart){
		this.baseScenario = baseScenario;
		this.baseLength = baseScenario.actions.length;
		this.safeStart = safeStart;
		this.increaseLength = 0;
		this.location = null;
	}	

	async genLocation(){
		winston.info(`baseLength is  ${this.baseLength}`);
		var effectBaseLength = await this.baseLength - this.safeStart;
		this.increaseLength = await Math.round(Math.random() * effectBaseLength);
		while (this.increaseLength === 0) {
			this.increaseLength = await Math.round(Math.random() * effectBaseLength);
		}

		winston.info(`the increaseLength of new Scenario is : ${this.increaseLength}`);
		var availablelist = await numberArrayGenerator(this.safeStart, this.baseLength - 1);
		var allPermutation = await Combinatorics.combination(availablelist, this.increaseLength).toArray();
		this.location = await allPermutation[Math.floor(Math.random() * allPermutation.length)];
		return Promise.resolve(this.location);
	}

}

module.exports.LenLocation = LenLocation;