const request = require('request');
const request_promise = require('request-promise');
const winston = require('winston');

const ProCalculater = require('./ProCalculater.js').ProCalculater;

const requestUrl = 'http://localhost';

class Step{

	constructor(updateStepInfo){
		this.updateStepInfo = updateStepInfo;
		this.type = updateStepInfo.type;
		this.bid = updateStepInfo.bid;
		this.noiseInfo = updateStepInfo.noiseInfo;
	}

	async initialSteps(){
		winston.info(`begin to initial all the steps`);
		await request.get(requestUrl + ':8086/candidate/', async (error, response, body) => {
			if (!error) {
				var candidates = JSON.parse(body);
				console.log(candidates.length);
				for (var i = 0; i < candidates.length; i++) {
					candidates[i].probability = await 1 / candidates.length;
					await request_promise({
						method: 'POST',
						uri: requestUrl + ':8086/init_step/',
						body: candidates[i],
						json: true
					})
					.then(function (parsedBody) {						
						return Promise.resolve(parsedBody);
					})
					.catch(function (err) {
						winston.info(`InitialStep to post action is error : ${err}`);
					});					
				}
			} else {
				winston.info(`InitialStep to request all the actions is error : ${error}`);
			}
		});
	}

	async updateStep(){
		//for four type cases
		switch(this.type){
			case 'FPCA' : await this.updateStepFPCA(); break;
			case 'TPCA_OUT' : await this.updateStepTPCA_OUT(); break;
			case 'TPCA_IN_TS' : await this.updateStepTPCA_IN_TS(); break;
			case 'TPCA_IN_TF' : await this.updateStepTPCA_IN_TF(); break;
		}		
		
	}

	async updateStepFPCA(){
		console.log("updateStepFPCA-----------------------");

		//find all the step
		//find the changing step and calculate probability
		
		let stepArray = await this.getAllStepsByBid();

		let stepId = await this.noiseInfo.stepId;
		let tempStep = await this.getOneStepById(stepId);
		await console.log(tempStep);

		let proCalculater = new ProCalculater(stepArray, tempStep);
		let newSteps = await proCalculater.genNewStepsFPCA();

		await this.postNewSteps(newSteps);

		let temp = await this.getOneStepById(stepId);

	}

	async updateStepTPCA_OUT(){
		await console.log("updateStepTPCA_OUT-----------------------");

		//find all the step
		//find the changing step and calculate probability
		//update all the steps into mongo

		let stepArray = await this.getAllStepsByBid();

		let stepId = await this.noiseInfo.stepId;
		let tempStep = await this.getOneStepById(stepId);
		await console.log(tempStep);

		let proCalculater = new ProCalculater(stepArray, tempStep);
		let newSteps = await proCalculater.genNewStepsTPCA_OUT();

		await this.postNewSteps(newSteps);

	}


	async updateStepTPCA_IN_TS(){
		console.log("updateStepTPCA_IN_TS+++++++++++++++++++++++");
		let stepArray = await this.getAllStepsByBid();

		await console.log(this.noiseInfo);
		let noiseSteps = await this.getNoiseSteps();
		await console.log(noiseSteps);

		let proCalculater = new ProCalculater(stepArray, noiseSteps);
		let newSteps = await proCalculater.genNewStepsTPCA_IN_TS();

		await this.postNewSteps(newSteps);

	}

	async updateStepTPCA_IN_TF(){
		console.log("updateStepTPCA_IN_TF+++++++++++++++++++++++");
		let stepArray = await this.getAllStepsByBid();

		await console.log(this.noiseInfo);
		let noiseSteps = await this.getNoiseSteps();
		await console.log(noiseSteps);

		let proCalculater = new ProCalculater(stepArray, noiseSteps);
		let newSteps = await proCalculater.genNewStepsTPCA_IN_TF();

		await this.postNewSteps(newSteps);

	}

	async getAllStepsByBid(){
		return new Promise( async (resolve, reject) => {

			let options = {  
				url: requestUrl + ':8086/step/bid/',
				body: { bid : this.bid },
				method: 'GET',
				json:true
			};

			await request.get( options, async (error, response, body) => {
				if (!error) {
					resolve(body);
				} else {
					winston.info(`request.get all the steps is error : ${error}`);
					reject(error);
				}
			});

		});
		
	}

	async getNoiseSteps(){
		let noiseSteps = [];
		for (var i = 0; i < this.noiseInfo.length; i++) {
			let temp = await this.getOneStepById(this.noiseInfo[i].stepId);
			if(temp.length ===1){
				await noiseSteps.push(temp[0]);
			}
		}
		return noiseSteps;
	}

	async getOneStepById(stepId){		
		return new Promise( async (resolve, reject) => {
			let options = {  
				url: requestUrl + ':8086/step/_id/',
				body: { _id : stepId },
				method: 'GET',
				json:true
			};

			await request.get( options, async (error, response, body) => {
				if (!error) {
					resolve(body);
				} else {
					winston.info(`request.get one step by _id is error : ${error}`);
					reject(error);
				}
			});

		});
		
	}

	async postNewSteps(newSteps){
		for (var i = 0; i < newSteps.length; i++) {
			await request_promise({
				method: 'POST',
				uri: requestUrl + ':8086/update_step/',
				body: newSteps[i],
				json: true
			})
			.then(function (parsedBody) {
				return Promise.resolve(parsedBody);
			})
			.catch(function (err) {
				winston.info(`UpdateStep to post UpdateStep is error : ${err}`);
			});
		}
	}

}

module.exports.Step = Step;