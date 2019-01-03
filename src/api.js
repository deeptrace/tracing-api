'use strict'

const appify = require('@deep-trace/appify')
const errorhandlers = require('./error-handlers.js')
const mongofactory = require('./mongo.js')
const routehandlers = require('./route-handlers.js')
const servicefactory = require('./service.js')
const storagefactory = require('./storage.js')

module.exports = appify(async (api, config, environment) => {
  const mongo = await mongofactory(config.mongodb)
  const storage = storagefactory(mongo, config)
  const service = servicefactory(storage)

  api.post('/v1/traces', routehandlers.traces.create(service))
  api.get('/v1/traces/:id', routehandlers.traces.inspect(service))

  api.use(errorhandlers.joi())
})
