'use strict'

const { appify, withConfig } = require('@deeptrace/appify')

const configfactory = require('./config.js')
const mongofactory = require('./mongo.js')
const servicefactory = require('./service.js')
const storagefactory = require('./storage.js')

module.exports = withConfig(configfactory, appify(async ({ router, config }) => {
  const mongo = await mongofactory(config.mongodb)
  const storage = storagefactory(mongo, config)
  const service = servicefactory(storage)

  require('./routes/create-trace.js').register(router, service)
  require('./routes/inspect-trace.js').register(router, service)

  require('./middlewares/joi-error-handler.js').register(router)
}))
