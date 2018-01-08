//input stepArray
//calculate the probability
//feedback updateStep datas

const request = require('request');
const requestUrl = 'http://localhost';
const winston = require('winston');

class ProCalculater{

	constructor(stepArray){
		this.stepArray = stepArray;
		this.pSum = this.stepArray[0].pSum;
	}
		
	calculateEachPro(stepItem) {
		const N = this.stepArray.length;
		var a = 1 / N;
		var b1 = -1;
		var b2 = -1 / (2 * N);
		var b3 = 1 / (2 * N);
		var b4 = 1 / (2 * N);
		var p = a + b1 * stepItem.FPCA + b2 * stepItem.TPCA_OUT + b3 * stepItem.TPCA_IN_TS + b4 * stepItem.TPCA_IN_TF;
		return p;
	}

	async sum(){
		for (var i = 0; i < this.stepArray.length; i++) {
			var p = await this.calculateEachPro(this.stepArray[i]);
			this.stepArray[i].probability = p;
			this.pSum = await this.pSum + p;
		}
	}

	async uniformPro(){
		for (var i = 0; i < this.stepArray.length; i++) {
			this.stepArray[i].sumPro = this.pSum;
			this.stepArray[i].uniformPro = await this.stepArray[i].probability / this.pSum;
		}
	}

	async refreshAllProbability(){
		await this.sum();
		await this.uniformPro();
		return Promise.resolve(this.stepArray);	
	}

}

module.exports.ProCalculater = ProCalculater;