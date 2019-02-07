/* eslint-env node, mocha */
import piton from '../src/api-getter'
import assert from 'assert'
import API_DEFINITIONS from './api-definitions.json'

describe('Api Getter', function () {
  it('Should get a result', async function () {
    this.timeout(5000)
    const testAPI = piton.getAPI(API_DEFINITIONS)
    let res = await testAPI.getAPI('http://environment.data.gov.uk/catchment-planning/so/WaterBody/GB105033042700')
    res = res[0]

    assert.equal('WaterBody', res.slug)
    assert.ok(Array.isArray(res.characteristics))
    assert.equal('Bottisham Lode - Quy Water', res.label)
  })

  it('Should download multiple results with one getter', async function () {
    this.timeout(5000)
    const testAPI = piton.getAPI(API_DEFINITIONS)
    let res1 = await testAPI.getAPI('http://environment.data.gov.uk/catchment-planning/so/WaterBody/GB105033042700')
    let res2 = await testAPI.getAPI('http://environment.data.gov.uk/catchment-planning/so/WaterBody/GB105033042750')

    assert.equal('Bottisham Lode - Quy Water', res1[0].label)
    assert.equal('Cam', res2[0].label)
  })
})
