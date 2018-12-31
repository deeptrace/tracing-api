'use strict'

module.exports = (trace, metadata, children) => Object.freeze({
  ...trace,
  children,
  ...metadata
})
