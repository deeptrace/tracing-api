'use strict'

const { UnprocessableEntityHttpError } = require('@deeptrace/appify')

module.exports.register = (router) => {
  router.use((err, _req, _res, next) => {
    if (!err.isJoi) {
      return next(err)
    }

    const details = err.details.map((item) => ({
      message: item.message,
      path: item.path.join('.')
    }))

    throw new UnprocessableEntityHttpError({
      code: 'FAILED_PAYLOAD_VALIDATION',
      message: err.message,
      details
    })
  })
}
