//input stepArray
//calculate the probability
//feedback updateStep datas

const request = require('request');
const requestUrl = 'http://localhost';
const winston = require('winston');

class ProCalculater{

	constructor(stepArray, noiseSteps){
		this.stepArray = stepArray;
		this.noiseSteps = noiseSteps;
	}
		
	calculateEachPro(stepItem) {
		const N = this.stepArray.length;
		// var a = 1 / N;
		var b1 = -1 / (10 * N);
		var b2 = -1 / (10 * N);
		var b3 = 1 / (10 * N);
		var b4 = 1 / (5 * N);
		var p = stepItem.probability + b1 * stepItem.FPCA + b2 * stepItem.TPCA_OUT + b3 * stepItem.TPCA_IN_TS + b4 * stepItem.TPCA_IN_TF;
		
		if (p > 0){
			return p;
		} else {
			return 0;
		}
		
	}

	async genNewStepsFPCA(){
		if( this.noiseSteps.length ===1 ){
			let tempStep = this.noiseSteps[0];
			tempStep.FPCA = await tempStep.FPCA + 1;

			let newPro = await this.calculateEachPro(tempStep);

			let decreasePro = await tempStep.probability - newPro;
			let otherStepIncreasePro = await decreasePro / (this.stepArray.length - this.noiseSteps.length);

			for (var i = 0; i < this.stepArray.length; i++) {
				if (this.stepArray[i]._id === tempStep._id){
					this.stepArray[i].FPCA = tempStep.FPCA;
					this.stepArray[i].probability = newPro;
				} else {
					this.stepArray[i].probability = await this.stepArray[i].probability + otherStepIncreasePro;
				}
			}

			return this.stepArray;
		}
	}

	async genNewStepsTPCA_OUT(){
		if( this.noiseSteps.length ===1 ){
			let tempStep = this.noiseSteps[0];
			tempStep.TPCA_OUT = await tempStep.TPCA_OUT + 1;

			let newPro = await this.calculateEachPro(tempStep);

			let decreasePro = await tempStep.probability - newPro;
			let otherStepIncreasePro = await decreasePro / (this.stepArray.length - this.noiseSteps.length);

			for (var i = 0; i < this.stepArray.length; i++) {
				if (this.stepArray[i]._id === tempStep._id){
					this.stepArray[i].TPCA_OUT = tempStep.TPCA_OUT;
					this.stepArray[i].probability = newPro;
				} else {
					this.stepArray[i].probability = await this.stepArray[i].probability + otherStepIncreasePro;
				}
			}

			return this.stepArray;
		}
	}

	async genNewStepsTPCA_IN_TS(){

		let otherStepDecreasePro = await this.calculateTPCA_IN_TS();

		console.log('updateTPCA_IN_TS otherStepDecreasePro is :' + otherStepDecreasePro);

		await this.loopAllStepsTPCA_IN_TS_or_TF(otherStepDecreasePro);

		return this.stepArray;

	}

	async calculateTPCA_IN_TS(){

		var sumProOfNoiseSteps = 0;

		for (let i = 0; i < this.noiseSteps.length; i++) {
			this.noiseSteps[i].TPCA_IN_TS = await this.noiseSteps[i].TPCA_IN_TS + 1;

			let newPro = await this.calculateEachPro(this.noiseSteps[i]);

			let increasePro = await this.noiseSteps[i].probability - newPro;

			sumProOfNoiseSteps = await sumProOfNoiseSteps + increasePro;			

			this.noiseSteps[i].probability = newPro;

		}

		console.log('sumProOfNoiseSteps is ' + sumProOfNoiseSteps);

		let otherStepDecreasePro = await sumProOfNoiseSteps / (this.stepArray.length - this.noiseSteps.length);
		console.log(otherStepDecreasePro);

		return otherStepDecreasePro;
	
	}

	async genNewStepsTPCA_IN_TF(){

		let otherStepDecreasePro = await this.calculateTPCA_IN_TF();

		console.log('updateTPCA_IN_TF otherStepDecreasePro is :' + otherStepDecreasePro);

		await this.loopAllStepsTPCA_IN_TS_or_TF(otherStepDecreasePro);

		return this.stepArray;

	}


	async calculateTPCA_IN_TF(){

		let sumProOfNoiseSteps = 0;

		for (let i = 0; i < this.noiseSteps.length; i++) {
			this.noiseSteps[i].TPCA_IN_TF = await this.noiseSteps[i].TPCA_IN_TF + 1;

			let newPro = await this.calculateEachPro(this.noiseSteps[i]);

			let increasePro = await this.noiseSteps[i].probability - newPro;

			sumProOfNoiseSteps = await sumProOfNoiseSteps + increasePro;			

			this.noiseSteps[i].probability = newPro;

		}

		let otherStepDecreasePro = await sumProOfNoiseSteps / (this.stepArray.length - this.noiseSteps.length);
		
		return otherStepDecreasePro;
	
	}

	async loopAllStepsTPCA_IN_TS_or_TF(otherStepDecreasePro){
		let noiseStepsStr = await JSON.stringify(this.noiseSteps);
		await console.log('loopAllStepsTPCA_IN_TS_or_TF noiseStepsStr is :' + noiseStepsStr);

		for (var i = 0; i < this.stepArray.length; i++) {			
			if (noiseStepsStr.indexOf(this.stepArray[i]._id) !== -1){
				await this.loopNoiseStepsTPCA_IN_TS_or_TF(i);
			} else {
				this.stepArray[i].probability = await this.stepArray[i].probability + otherStepDecreasePro;
			}
		}
	}

	async loopNoiseStepsTPCA_IN_TS_or_TF(i){
		for (var j = 0; j < this.noiseSteps.length; j++) {
			if (this.stepArray[i]._id === this.noiseSteps[j]._id){
				this.stepArray[i] = this.noiseSteps[j];
			}				
		}		
	}

}


// async loopAllStepsTPCA_IN_TS(otherStepDecreasePro){
// 	let noiseStepsStr = await JSON.stringify(this.noiseSteps);
// 	await console.log('loopAllStepsTPCA_IN_TS noiseStepsStr is :' + noiseStepsStr);

// 	for (var i = 0; i < this.stepArray.length; i++) {			
// 		if (noiseStepsStr.indexOf(this.stepArray[i]._id) !== -1){
// 			await this.loopNoiseStepsTPCA_IN_TS(i);
// 		} else {
// 			this.stepArray[i].probability = await this.stepArray[i].probability + otherStepDecreasePro;
// 		}
// 	}
// }

// async loopNoiseStepsTPCA_IN_TS(i){
// 	for (var j = 0; j < this.noiseSteps.length; j++) {
// 		if (this.stepArray[i]._id === this.noiseSteps[j]._id){
// 			this.stepArray[i] = this.noiseSteps[j];
// 		}				
// 	}		
// }

module.exports.ProCalculater = ProCalculater;