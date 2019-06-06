'use strict'

const { config, halt } = require('@deeptrace/config')

module.exports = halt(() => config(({ env, is }) => ({
  deeptrace: { dsn: null },
  namespace: env('DEEPTRACE_NAMESPACE', [ is.defaultTo('traces') ]),
  mongodb: {
    db: env('DEEPTRACE_MONGODB_DB', [ is.defaultTo('deeptrace') ]),
    uri: env('DEEPTRACE_MONGODB_URI', [ is.required() ])
  }
})))
