'use strict'

const { config, halt } = require('@deeptrace/config')

module.exports = halt(() => config(({ env, is }) => ({
  namespace: env('DEEPTRACE_NAMESPACE', [ is.defaultTo('traces') ]),
  mongodb: {
    db: env('DEEPTRACE_MONGODB_DB', [ is.required() ]),
    uri: env('DEEPTRACE_MONGODB_URI', [ is.required() ])
  }
})))
