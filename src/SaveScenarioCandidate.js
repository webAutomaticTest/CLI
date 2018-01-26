const request_promise = require('request-promise');
const requestUrl = 'http://localhost';

function saveBaseScenario(baseScenarioJson){
	return request_promise({
		method: 'POST',
		uri: requestUrl + ':8086/base/',
		body: baseScenarioJson,
		json: true
	})
    .then(function (parsedBody) {// POST succeeded    	
    	return Promise.resolve(parsedBody);   	
    })
    .catch(function (err) {// POST failed...
    	console.log(err);
    	return Promise.reject(err);
    });
}

async function saveBaseActions(baseScenarioActions){//input baseScenarionActions and save all the actions to mongodb table action
    for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
        await request_promise({
            method: 'POST',
            uri: requestUrl + ':8086/action/',
            body: baseScenarioActions[i],
            json: true
        })
        .then(function (parsedBody) {// POST succeeded...
            // return Promise.resolve(parsedBody);
        })
        .catch(function (err) {// POST failed...
            console.log(err);
            // return Promise.reject(err);
        });
    }
}

async function crawlCandidate(baseScenario){
    var baseScenarioActions = baseScenario.actions;
    var bid = baseScenario._id;

    for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
        var newActions = await baseScenarioActions.slice(0, i + 1);
        var sce = {"actions" : newActions, "bid" : bid};
        await request_promise({
            method: 'POST',
            uri: requestUrl + ':8091/crawlNow/',
            body: sce,
            json: true
        })
        .then(function (parsedBody) {
            console.log(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
        });
        
    }
}

async function genCrawlScenarios(baseScenario){
    var baseScenarioActions = baseScenario.actions;
    var bid = baseScenario._id;
    var crawlScenarios = [];
    for (var i = 0; i <= baseScenarioActions.length - 1; i++) {
        var newActions = await baseScenarioActions.slice(0, i + 1);
        var sce = {"actions" : newActions, "bid" : bid};
        await crawlScenarios.push(sce);        
        
    }
    return crawlScenarios;
}

async function postToCrawl(crawlScenarios){

    for (var i = 0; i < crawlScenarios.length; i++) {
        await request_promise({
            method: 'POST',
            uri: requestUrl + ':8091/crawlNow/',
            body: crawlScenarios[i],
            json: true
        })
        .then(function (parsedBody) {
            console.log(parsedBody);
        })
        .catch(function (err) {
            console.log(err);
        });
    }
    await console.log("SaveScenarioCandidate function postToCrawl is finish!");
}


module.exports.saveBaseScenario = saveBaseScenario;
module.exports.saveBaseActions = saveBaseActions;
module.exports.crawlCandidate = crawlCandidate;
module.exports.genCrawlScenarios = genCrawlScenarios;
module.exports.postToCrawl = postToCrawl;