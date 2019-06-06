'use strict'

const COLLECTION_INDEXES = [
  {
    key: { 'trace.id': 1 },
    name: 'deeptrace__trace_id',
    background: true
  },
  {
    key: { 'trace.parentid': 1 },
    name: 'deeptrace__trace_parentid',
    background: true
  }
]

const DEFAULT_OPERATION_OPTIONS = {
  projection: {
    trace: 1,
    metadata: 1
  }
}

module.exports = (mongo, { namespace }) => {
  const collection = mongo.collection(namespace)

  collection
    .createIndexes(COLLECTION_INDEXES)
    .catch((err) => { console.error(err) })

  return {
    async create (trace, metadata) {
      await collection.insertOne({ trace, metadata })
    },
    async exists (id) {
      return collection
        .findOne({ 'trace.id': id }, { projection: { _id: 1 } })
        .then((doc) => !!doc)
    },
    async findOneById (id) {
      return collection.findOne({ 'trace.id': id }, DEFAULT_OPERATION_OPTIONS)
    },
    async findAllByParentId (parentid) {
      return collection
        .find({ 'trace.parentid': parentid }, DEFAULT_OPERATION_OPTIONS)
        .toArray()
    }
  }
}
