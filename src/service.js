'use strict'

const { DuplicatedTraceError, TraceNotFoundError } = require('./errors.js')
const joi = require('joi')

const schema = joi.object().required().keys({
  id: joi.string().uuid().required(),
  parentid: joi.string().uuid().required().allow(null),
  rootid: joi.string().uuid().required(),
  tags: joi.object().pattern(joi.string(), joi.string().allow(null)).required(),
  caller: joi.object().required().unknown().keys({
    ip: joi.string().ip().required(),
  }),
  request: joi.object().required().keys({
    method: joi.string().required(),
    url: joi.string().uri({ scheme: [ 'http', 'https' ] }).trim().required(),
    headers: joi.object().pattern(joi.string(), joi.string()).required(),
    search: joi.string().required().allow(null),
    body: joi.string().required().allow(null),
    timestamp: joi.date().iso().required()
  }),
  response: joi.object().required().keys({
    status: joi.number().integer().required(),
    headers: joi.object().pattern(joi.string(), joi.string()).required(),
    body: joi.string().required().allow(null),
    timestamp: joi.date().iso().required()
  }),
  timestamp: joi.date().iso().required()
})

const diffms = (a, b) => {
  return new Date(a).getTime() - new Date(b).getTime()
}

const computedProps = (trace, metadata) => ({
  took: diffms(trace.response.timestamp, trace.request.timestamp),
  timestamp: metadata.timestamp
})

const mergeWithComputedProps = (trace, metadata, children) => Object.freeze({
  ...trace,
  children,
  ...computedProps(trace, metadata)
})

const recursiveinspect = async (storage, { trace, metadata }) => {
  const children = await storage
    .findAllByParentId(trace.id)
    .then((entries) => Promise.all(entries.map((entry) => {
      return recursiveinspect(storage, entry)
    })))

  return mergeWithComputedProps(trace, metadata, children)
}

module.exports = (storage) => ({
  async create (input) {
    const trace = await schema.validate(input)
    const metadata = { timestamp: new Date() }

    if (await storage.exists(trace.id)) {
      throw DuplicatedTraceError.factory(trace.id)
    }

    await storage.create(trace, metadata)
  },
  async inspect (traceid) {
    const entry = await storage.findOneById(traceid)

    if (!entry) {
      throw TraceNotFoundError.factory(traceid)
    }

    return recursiveinspect(storage, entry)
  }
})
