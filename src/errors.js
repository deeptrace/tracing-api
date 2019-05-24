'use strict'

const { Error } = require('@deeptrace/appify')

class DeepTraceError extends Error {
  //
}

class DuplicatedTraceError extends DeepTraceError {
  static factory (id) {
    return new DuplicatedTraceError(
      `There's another trace with the same id "${id}". Did you know that a sample of 3.26*10^16 UUIDs has a 99.99% chance of not having any duplicates?`
    )
  }
}

class TraceNotFoundError extends DeepTraceError {
  static factory (id) {
    return new TraceNotFoundError(
      `Couldn't find a trace with id "${id}". Are you sure that's the right id?`
    )
  }
}

module.exports.DeepTraceError = DeepTraceError
module.exports.DuplicatedTraceError = DuplicatedTraceError
module.exports.TraceNotFoundError = TraceNotFoundError
