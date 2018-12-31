'use strict'

const errors = require('./errors.js')
const joi = require('joi')
const view = require('./trace-view.js')

const schema = joi.object().required().keys({
  id: joi.string().uuid().required(),
  parentid: joi.string().uuid().required().allow(null),
  rootid: joi.string().uuid().required(),
  tags: joi.object().pattern(joi.string(), joi.string().allow(null)).required(),
  request: joi.object().required().keys({
    method: joi.string().required(),
    uri: joi.string().uri().trim().required(),
    headers: joi.object().pattern(joi.string(), joi.string()).required(),
    body: joi.string().required().allow(null),
    timestamp: joi.date().iso().raw().required()
  }),
  response: joi.object().required().keys({
    status: joi.number().integer().required(),
    headers: joi.object().pattern(joi.string(), joi.string()).required(),
    body: joi.string().required().allow(null),
    timestamp: joi.date().iso().raw().required()
  })
})

const recursiveinspect = async (storage, { trace, metadata }) => {
  const children = await storage
    .findAllByParentId(trace.id)
    .then((entries) => Promise.all(entries.map((entry) => {
      return recursiveinspect(storage, entry)
    })))

  return view(trace, metadata, children)
}

module.exports = (storage) => ({
  async create (input) {
    // Requests with invalid input schema will cause joi to throw an exception which
    // will be handled by joi error handler middleware, returning a 422 response.
    const trace = await schema.validate(input)
    const metadata = { timestamp: new Date() }

    if (await storage.exists(trace.id)) {
      throw errors.DuplicatedTraceError.factory(trace.id)
    }

    await storage.create(trace.id, trace, metadata)
  },
  async inspect (traceid) {
    const entry = await storage.findOneById(traceid)

    if (!entry) {
      throw errors.TraceNotFoundError.factory(traceid)
    }

    return recursiveinspect(storage, entry)
  }
})
