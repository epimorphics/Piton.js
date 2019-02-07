/* eslint-env node, mocha */
import assert from 'assert'
import { ensureIsSingle, findObjectType, stripWrapper } from '../src/util'

describe('Utilities', function () {
  describe('#findObjectType()', function () {
    it('should return empty when the value is not present', function () {
      let obj = { type: { '@id': 'http://www.example.com' } }
      assert.equal(undefined, findObjectType(obj, ['']))
    })
    it('should return id when the value is present', function () {
      let obj = { type: { '@id': 'http://www.example.com' } }
      assert.equal(obj.type['@id'], findObjectType(obj, ['http://www.example.com']))
    })
  })

  describe('#ensureIsSingle()', function () {
    it('should return same object if passed object', function () {
      let obj = { foo: 'bar' }
      assert.equal(obj, ensureIsSingle(obj))
    })
    it('should return object unwrapped from array if passed object', function () {
      let obj = { foo: 'bar' }
      assert.deepEqual(obj, ensureIsSingle([obj]))
    })
    it('should return primitive if passed primitive', function () {
      let obj = 1
      assert.deepEqual(obj, ensureIsSingle([obj]))
    })
  })

  describe('#stripWrapper()', function () {
    it('Removes data from wrapper', function () {
      let obj = { items: [ 'a', 'b', 'c' ] }
      assert.equal(obj.items, stripWrapper(obj))
    })
    it('Leaves unwrapped object intact', function () {
      let obj = { foo: 'bar' }
      assert.equal(obj, stripWrapper(obj))
    })
  })
})
