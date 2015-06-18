var assert   = require('assert')
  , mock     = require('./redis-mock')
  , indexing = require('../lib/indexing')

describe('indexing', function () {
  it('should raise an error if id is not an integer', function () {
    var redis   = mock.createClient()

    assert.throws(function () { indexing(redis) })
    assert.throws(function () { indexing(redis, null) })
    assert.throws(function () { indexing(redis, 4.4) })
    assert.throws(function () { indexing(redis, '') })
    assert.throws(function () { indexing(redis, new Date()) })
  })
})

describe('indexing', function () {
  it('should raise an error if no text is provided', function () {
    var redis   = mock.createClient()

    assert.throws(function () { indexing(redis, 1337) })
  })
})

describe('indexing', function () {
  it('should return false if there\'s nothing to index', function () {
    var redis   = mock.createClient()

    assert(!indexing(redis, 1, 'Como?'))
  })
})

describe('indexing', function () {
  it('should index correctly', function () {
    var redis   = mock.createClient()

    assert(indexing(redis, 23, '\
  É bom\n\
  Passar uma tarde em Itapuã\n\
  Ao sol que arde em Itapuã\n\
  Ouvindo o mar de Itapuã\n\
  Falar de amor em Itapuã'))

    assert.deepEqual(redis.db.bom, [ 23 ])
    assert.deepEqual(redis.db.passar, [ 23 ])
    assert.deepEqual(redis.db.tarde, [ 23 ])
    assert.deepEqual(redis.db.itapua, [ 23 ])
    assert.deepEqual(redis.db.sol, [ 23 ])
    assert.deepEqual(redis.db.arde, [ 23 ])
    assert.deepEqual(redis.db.falar, [ 23 ])
    assert.deepEqual(redis.db.amor, [ 23 ])

    assert.deepEqual(redis.db['23:bom'], [ 0 ])
    assert.deepEqual(redis.db['23:passar'], [ 1 ])
    assert.deepEqual(redis.db['23:tarde'], [ 2 ])
    assert.deepEqual(redis.db['23:itapua'], [ 3, 6, 9, 12 ])
    assert.deepEqual(redis.db['23:sol'], [ 4 ])
    assert.deepEqual(redis.db['23:arde'], [ 5 ])
    assert.deepEqual(redis.db['23:ouvindo'], [7])
    assert.deepEqual(redis.db['23:mar'], [ 8 ])
    assert.deepEqual(redis.db['23:falar'], [ 10 ])
    assert.deepEqual(redis.db['23:amor'], [ 11 ])
  })
})

