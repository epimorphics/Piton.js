/* eslint-env node, mocha */
import assert from 'assert'
import assertThrows from 'assert-throws-async'
import * as checker from '../src/api-parser'
import { ensureIsSingle, stripWrapper } from '../src/util'
import API_DEFINITIONS from './api-definitions.json'

import riverBasinDistrict from './data/12.json'
import managementCatchment from './data/3049.json'
import operationalCatchment from './data/3216.json'
import waterbody from './data/GB109053027530.json'

import _ from 'lodash'

// Perform utility automatically based on type asked for

// Give utility functions that can be built from API endpoint and prototype.
// Take ID and build full objects
// Support prop: [{type:}]
// Can we ask it to automatically get additional data using JSON definitions?
// JSON - Expand properties by JSON getting them
// Can it simplify complex properties? Lang tags for example.

describe('Api Checker', function () {
  describe('#processAPIResponse()', function () {
    describe('general', function () {
      let proto = ensureIsSingle(stripWrapper(_.cloneDeep(riverBasinDistrict)))

      it('should work for single values', async function () {
        let processed = await checker.processAPIResponse(proto, API_DEFINITIONS)
        assert.equal('RiverBasinDistrict', processed.slug)
      })
      it('should work for array values', async function () {
        let processed = await checker.processAPIResponse([_.cloneDeep(proto)], API_DEFINITIONS)
        assert.equal(1, processed.length)
        assert.equal('RiverBasinDistrict', processed[0].slug)
      })
      it('should work for multi-dimensional array values', async function () {
        let processed = await checker.processAPIResponse([[_.cloneDeep(proto)]], API_DEFINITIONS)
        assert.equal(1, processed.length)
        assert.equal(1, processed[0].length)
        assert.equal('RiverBasinDistrict', processed[0][0].slug)
      })
      it('should throw an error if needed property doesn\'t exist', async function () {
        let obj = _.cloneDeep(proto)
        delete obj.label
        assertThrows(async function () {
          await checker.processAPIResponse(obj, API_DEFINITIONS)
        })
      })
      it('should fill out properties with @id', async function () {
        this.timeout(10 * 1000)
        const myDefs = {
          'http://environment.data.gov.uk/catchment-planning/def/water-framework-directive/RiverBasinDistrict': {
            statics: { type: [] },
            props: { type: 'type' },
            required: ['type']
          }
        }
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), myDefs)
        assert.equal('River basin district', processed.type[0].label)
      })
    })

    describe('riverBasinDistrict', function () {
      let proto = ensureIsSingle(stripWrapper(_.cloneDeep(riverBasinDistrict)))

      it('should add type and slug', async function () {
        let processed = await checker.processAPIResponse(proto, API_DEFINITIONS)
        assert.equal('River Basin District', processed.type)
        assert.equal('RiverBasinDistrict', processed.slug)
      })
      it('should copy notation and label', async function () {
        let processed = await checker.processAPIResponse(proto, API_DEFINITIONS)
        assert.equal(proto.label, processed.label)
        assert.equal(proto.notation, processed.notation)
      })
    })

    describe('management Catchment', function () {
      let proto = ensureIsSingle(stripWrapper(_.cloneDeep(managementCatchment)))

      it('should add type and slug', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal('Management Catchment', processed.type)
        assert.equal('ManagementCatchment', processed.slug)
      })
      it('should copy notation and label', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal(proto.label, processed.label)
        assert.equal(proto.notation, processed.notation)
      })
    })

    describe('operational Catchment', function () {
      let proto = ensureIsSingle(stripWrapper(_.cloneDeep(operationalCatchment)))

      it('should add type and slug', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal('Operational Catchment', processed.type)
        assert.equal('OperationalCatchment', processed.slug)
      })
      it('should copy notation and label', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal(proto.label, processed.label)
        assert.equal(proto.notation, processed.notation)
      })
    })

    describe('waterBody', function () {
      let proto = ensureIsSingle(stripWrapper(_.cloneDeep(waterbody)))

      it('should add type and slug', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal('Water Body', processed.type)
        assert.equal('WaterBody', processed.slug)
      })
      it('should copy notation and label', async function () {
        let processed = await checker.processAPIResponse(_.cloneDeep(proto), API_DEFINITIONS)
        assert.equal(proto.currentVersion.label, processed.label)
        assert.equal(proto.notation, processed.notation)
      })
    })
  })
})
