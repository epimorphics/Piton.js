const _ = require('lodash')
axios = require('axios')
// Ensures var passed in is of type Array,
// or adds it to new Array
function ensureIsArray (prop) {
  if (Array.isArray(prop)) return prop
  return [prop]
}

// Return first item in array
function ensureIsSingle (prop) {
  if(!Array.isArray(prop)) return prop
  return prop[0]
}

// Find type of object given list of defined types
// Returns String type
function findObjectType (obj = {}, definitions = []) {
  if (!obj.type) return
  return ensureIsArray(obj.type).find((val) => {
    if (val['@id']) val = val['@id']
    return definitions.indexOf(val) > -1
  })
}

// Remove wrapper from API response
// Returns items property if exists
function stripWrapper (res) {
  if (res.items) {
    return res.items
  }
  return res
}

function checkExists (obj, required) {
  // Check properties exist
  console.log(required)
  for (let prop of required) {
    if(!obj.hasOwnProperty(prop) || typeof obj[prop] === 'undefined') {
      return prop
    }
  }
}

// Process a pre-processed API response.
// Obj - 'Items' response from the server
// Definitions - Custom object definitions mapped to their type
// Hops - Number of hops since the original call.
async function processAPIResponse (obj = {}, definitions = {}, hops = 0) {
  return new Promise(async (resolve, reject) => {
    if (Array.isArray(obj)) {
      return resolve(
        Promise.all(
          obj.map((item) => {
            return processAPIResponse(item, definitions)
          })
        )
      )
    }

    if(obj['@id'] && Object.keys(obj).length === 1 && hops < 2) {
      // simply @id with no data.
      ++hops // Increment hops
      obj = await axios.get(obj['@id'], {headers: {'Accept': 'application/json'}})
        .catch((e) => {
          console.log('Promise error', e)
        })
        .then((resp) => stripWrapper(resp.data))
        .then(ensureIsSingle)
    }

    // Find type of obj - Assuming they're all the same
    const objType = findObjectType(obj, Object.keys(definitions)) // Get objects type
    if (!objType) return resolve(obj)

    // Get definition of object type
    const DEFINITION = definitions[objType['@id']] // TODO Cleanup this to not be object but string
    // Apply transform.
    let rtn = JSON.parse(JSON.stringify(DEFINITION.statics))
    for (let prop in DEFINITION.props) {
      let val = _.get(obj, DEFINITION.props[prop])
      if (!val) continue
      if (val.type) {
        val = await processAPIResponse(val, definitions)
      }
      if (Array.isArray(val)) {
        // Array value. Process each individually
        val = await processAPIResponse(val, definitions, ++hops)
      }
      if (val['@id'] && Object.keys(val).length === 1) {
        val = await processAPIResponse(val, definitions, ++hops)
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
    }

    if(DEFINITION.required && checkExists(rtn, DEFINITION.required)) {
      reject(new Error('property: ' + checkExists(rtn, DEFINITION.required) + ' not in obj: ' + JSON.stringify(rtn)))
    }

    return resolve(rtn)
  })
}

exports.processAPIResponse = processAPIResponse
exports.ensureIsArray = ensureIsArray
exports.ensureIsSingle = ensureIsSingle
exports.findObjectType = findObjectType
exports.stripWrapper = stripWrapper
exports.checkExists = checkExists
