'use strict'

const { HttpError } = require('@deep-trace/appify')

module.exports = {
  joi: () => {
    return (err, req, res, next) => {
      if (!err.isJoi) {
        return next(err)
      }

      const details = err.details.map((item) => ({
        message: item.message,
        path: item.path.join('.')
      }))

      throw new HttpError
        .UnprocessableEntity(err.message, 'FAILED_PAYLOAD_VALIDATION')
        .with(details)
    }
  }
}
