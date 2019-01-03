'use strict'

const { env } = require('@deep-trace/appify')

module.exports = {
  namespace: env.get('DEEPTRACE_NAMESPACE', 'deep-trace'),
  mongodb: {
    db: env.get('DEEPTRACE_MONGODB_DB'),
    uri: env.get('DEEPTRACE_MONGODB_URI')
  }
}
