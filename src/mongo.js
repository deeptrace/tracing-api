'use strict'

const { MongoClient } = require('mongodb')

const DEFAULT_SETTINGS = {
  poolSize: 10,
  useNewUrlParser: true
}

module.exports = async ({ uri, db, options = { } }) => {
  const conn = await MongoClient.connect(uri, {
    ...DEFAULT_SETTINGS,
    ...options
  })

  const database = conn.db(db)
  const admin = database.admin()

  return {
    collection: (name) => database.collection(name),
    healthcheck: async () => admin.serverStatus(),
    close: async () => conn.close()
  }
}
