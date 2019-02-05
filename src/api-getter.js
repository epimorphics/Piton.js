import fetch from 'superagent'

import { processAPIResponse } from './api-parser'
import { stripWrapper } from './util'

/**
 * API-Getter is a Promise-based wrapper to API-Parser that supports getting results from a GET API endpoint.
 * The parser is re-usable multiple times with one instantiation.
 *
 * @returns {Object}
 */
function getAPI (API_DEFINITIONS) {
  if (!API_DEFINITIONS) {
    throw new Error('API_DEFINITIONS need to be defined')
  }

  return {
    /**
     * Fetches API and parses for definitions
     * @param {string} endpoint
     */
    getAPI (endpoint) {
      return fetch.get(endpoint)
        .set('Accept', 'application/json')
        .then(resp => {
          resp = stripWrapper(resp.body)

          if (endpoint.last === '/' && Array.isArray(resp)) {
            resp = resp[0]
          }

          return processAPIResponse(resp, API_DEFINITIONS)
        })
    }
  }
}

export default {
  getAPI
}
