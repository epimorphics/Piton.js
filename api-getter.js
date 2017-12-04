const axios = require('axios')
var checker = require('./api-parser.js')
// const API_DEFINITIONS = require('./test/api-definitions.json')


function epiAPI (API_DEFINITIONS) {
  return {
    getAPI: function (endpoint) {
      return axios.get(endpoint)
        .then((resp) => checker.stripWrapper(resp.data))
        .then((resp) => {
          if (endpoint[endpoint.length - 1] === '/') {
            return checker.ensureIsSingle(resp)
          } else {
            return resp
          }
        })
        .then((res) => checker.processAPIResponse(res, API_DEFINITIONS))
    }
  }
}

// Example calling
// async function doThing () {
//   let myAPI = new EpiAPI(API_DEFINITIONS)
//   let resp = await myAPI.getAPI('http://environment.data.gov.uk/catchment-planning/so/WaterBody/GB109053027530.json')
//   console.log(JSON.stringify(resp))
// }

// doThing()

exports.epiAPI = epiAPI
