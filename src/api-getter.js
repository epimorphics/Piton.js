/*
  API-Getter is a Promise-based wrapper to API-Parser that supports getting results from a GET API endpoint.
  The parser is re-usable multiple times with one instantiation.
*/

const fetch = require('superagent')
var apiParser = require('./api-parser.js')

function getAPI (API_DEFINITIONS) {
  if (!API_DEFINITIONS) {
    throw new Error('API_DEFINITIONS need to be defined')
  }
  return {
    getAPI: function (endpoint) {
      return fetch.get(endpoint)
        .then((resp) => apiParser.stripWrapper(resp.body))
        .then((resp) => {
          if (endpoint[endpoint.length - 1] === '/') {
            return apiParser.ensureIsSingle(resp)
          } else {
            return resp
          }
        })
        .then((res) => apiParser.processAPIResponse(res, API_DEFINITIONS))
    }
  }
}

export default {
  getAPI
}
