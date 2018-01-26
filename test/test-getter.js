/* eslint-env node, mocha */
var assert = require('assert')
const assertThrows = require('assert-throws-async')
var getter = require('../src/api-getter.js')
const API_DEFINITIONS = require('./api-definitions.json')

const riverBasinDistrict = require('./data/12.json')
const managementCatchment = require('./data/3049.json')
const operationalCatchment = require('./data/3216.json')
const waterbody = require('./data/GB109053027530.json')

var _ = require('lodash')

describe('Api Getter', function () {
  it('Should get a result', async function () {
    this.timeout(5000)
    const testAPI = getter.getAPI(API_DEFINITIONS)
    let res = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042700.json')
    res = res[0]
    assert.equal('WaterBody', res.slug)
    assert.ok(Array.isArray(res.characteristics))
    assert.equal('Bottisham Lode - Quy Water', res.label)
  })

  it('Should download multiple results with one getter', async function () {
    this.timeout(5000)
    const testAPI = getter.getAPI(API_DEFINITIONS)
    let res1 = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042700.json')
    let res2 = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042750.json')
    assert.equal('Bottisham Lode - Quy Water', res1[0].label)
    assert.equal('Cam', res2[0].label)
  })
})
