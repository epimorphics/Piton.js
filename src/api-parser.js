import cloneDeep from 'lodash/cloneDeep'
import loGet from 'lodash/get'
import fetch from 'superagent'
import URL from 'url-parse'

import { findObjectType, stripWrapper, ensureIsSingle } from '../src/util'

function getResponse (fetchUrl) {
  return fetch.get(fetchUrl)
    .set('Accept', 'application/json')
    .then(responseHandler)
}

function responseHandler (res) {
  return ensureIsSingle(stripWrapper(res.body))
}

/**
 * Process a pre-processed API response.
 *
 * @async
 * @param {object} obj 'Items' response from the server
 * @param {object} definitions Custom object definitions mapped to their type
 * @param {number=0} hops Number of hops since the original call.
 * @param {boolean=true} forceHttps
 */
async function processAPIResponse (obj = {}, definitions = {}, hops = 0, forceHttps = true) {
  if (Array.isArray(obj)) {
    return Promise.all(
      obj.map(item => processAPIResponse(item, definitions))
    )
  }

  if (obj['@id'] && Object.keys(obj).length === 1 && hops < 2) {
    // simply @id with no data.
    let fetchUrl = obj['@id']
    if (forceHttps) {
      // Transform to https url.
      let parsedUrl = new URL(fetchUrl)
      if (parsedUrl.protocol === 'http:') {
        console.log('Forcing https')
        parsedUrl.protocol = 'https:'
      }
      fetchUrl = parsedUrl.toString()
    }

    console.log('Loading data for: ', fetchUrl)

    obj = await getResponse(fetchUrl)
      .catch(e => {
        console.log('Cannot get secure. Dropping to http')
        return getResponse(obj['@id'])
      })
      .catch(e => obj)
  }

  // Find type of obj
  let objType = findObjectType(obj, Object.keys(definitions)) // Get objects type
  if (!objType) {
    return obj
  }

  if (objType['@id']) {
    objType = objType['@id']
  }

  // Get definition of object type
  const DEFINITION = definitions[objType] // TODO Cleanup this to not be object but string
  if (!DEFINITION) {
    return obj
  }

  // Apply transform.
  let rtn = cloneDeep(DEFINITION.statics)

  await Promise.all(Object.keys(DEFINITION.props).map(async prop => {
    let val = loGet(obj, DEFINITION.props[prop])

    if (!val) return

    if (val.type) {
      val = await processAPIResponse(val, definitions)
    }

    if (Array.isArray(val)) {
      // Array value. Process each individually
      val = await processAPIResponse(val, definitions, hops + 1)
    }

    if (val['@id'] && Object.keys(val).length === 1) {
      val = await processAPIResponse(val, definitions, hops + 1)
    }

    // Add the value to object being built
    if (Array.isArray(rtn[prop])) { // Add / Append value to array
      if (Array.isArray(val)) {
        rtn[prop] = rtn[prop].concat(val) // Concatenate Arrays
      } else {
        rtn[prop].push(val) // Add to Array
      }
    } else {
      rtn[prop] = val
    }
  }))

  if (DEFINITION.required) {
    const props = DEFINITION.required.filter(
      prop => !rtn.hasOwnProperty(prop) || typeof rtn[prop] === 'undefined'
    )

    if (props.length) {
      throw new Error(`properties: [${props.join(', ')}] not in obj: ${JSON.stringify(rtn)}`)
    }
  }

  return rtn
}

export {
  processAPIResponse
}
