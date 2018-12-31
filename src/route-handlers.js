'use strict'

const errors = require('./errors.js')
const rescue = require('express-rescue')

module.exports = {
  traces: {
    create: (service) => ([
      rescue(async (req, res) => {
        res.status(204).end(await service.create(req.body))
      }),
      rescue.from(errors.DuplicatedTraceError, (err) => {
        throw new errors.HttpError.Conflict(err.message, 'DUPLICATED_TRACE')
      })
    ]),
    inspect: (service) => ([
      rescue(async (req, res) => {
        res.status(200).json(await service.inspect(req.params.id))
      }),
      rescue.from(errors.TraceNotFoundError, (err) => {
        throw new errors.HttpError.NotFound(err.message, 'TRACE_NOT_FOUND')
      })
    ])
  }
}
