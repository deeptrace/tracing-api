'use strict'

const { MongoClient } = require('mongodb')
const retry = require('promise-retry')

const DEFAULT_SETTINGS = {
  poolSize: 10,
  useNewUrlParser: true
}

module.exports = async ({ uri, db, options = { } }) => {
  const conn = await retry((retry) => (
    MongoClient
      .connect(uri, { ...DEFAULT_SETTINGS, ...options })
      .catch(retry)
  ))

  const database = conn.db(db)
  const admin = database.admin()

  return {
    collection: (name) => database.collection(name),
    healthcheck: async () => admin.serverStatus(),
    close: async () => conn.close()
  }
}
