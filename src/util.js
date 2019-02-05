import castArray from 'lodash/castArray'

// Return first item in array
export const ensureIsSingle =
    prop => prop && Array.isArray(prop) ? prop[0] : prop

// Find type of object given list of defined types
// Returns String type
export function findObjectType (obj = {}, definitions = []) {
  if (!obj.type) return

  let types = castArray(obj.type)
    .map(typ => typ['@id'] || typ)

  return definitions.find(val => types.indexOf(val) > -1)
}

// Remove wrapper from API response
// Returns items property if exists
export const stripWrapper =
    res => res && res.items ? res.items : res
