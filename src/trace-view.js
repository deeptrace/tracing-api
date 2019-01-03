'use strict'

const URL = require('url')

const diffms = (a, b) =>  {
  return new Date(a).getTime() - new Date(b).getTime()
}

const computed = (trace, metadata) => ({
  took: diffms(trace.response.timestamp, trace.request.timestamp),
  timestamp: metadata.timestamp
})

module.exports = (trace, metadata, children) => Object.freeze({
  ...trace,
  children,
  ...computed(trace, metadata)
})
