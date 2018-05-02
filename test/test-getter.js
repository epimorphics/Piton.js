/* eslint-env node, mocha */
import piton from '../src/api-getter.js'
var assert = require('assert')
const API_DEFINITIONS = require('./api-definitions.json')

describe('Api Getter', function () {
  it('Should get a result', async function () {
    this.timeout(5000)
    const testAPI = piton.getAPI(API_DEFINITIONS)
    let res = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042700.json')
    res = res[0]
    assert.equal('WaterBody', res.slug)
    assert.ok(Array.isArray(res.characteristics))
    assert.equal('Bottisham Lode - Quy Water', res.label)
  })

  it('Should download multiple results with one getter', async function () {
    this.timeout(5000)
    const testAPI = piton.getAPI(API_DEFINITIONS)
    let res1 = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042700.json')
    let res2 = await testAPI.getAPI('http://ea-cde-pub.epimorphics.net/catchment-planning/so/WaterBody/GB105033042750.json')
    assert.equal('Bottisham Lode - Quy Water', res1[0].label)
    assert.equal('Cam', res2[0].label)
  })
})
