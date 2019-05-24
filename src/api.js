'use strict'

const { appify } = require('@deeptrace/appify')

const mongofactory = require('./mongo.js')
const servicefactory = require('./service.js')
const storagefactory = require('./storage.js')

module.exports = appify(async ({ router, config }) => {
  const mongo = await mongofactory(config.mongodb)
  const storage = storagefactory(mongo, config)
  const service = servicefactory(storage)

  require('./routes/create-trace.js').register(router, service)
  require('./routes/inspect-trace.js').register(router, service)

  require('./middlewares/joi-error-handler.js').register(router)
})
