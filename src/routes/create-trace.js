'use strict'

const errors = require('../errors.js')
const rescue = require('express-rescue')
const { ConflictHttpError } = require('@deeptrace/appify')

module.exports.register = (router, service) => {
  router.post('/traces', [
    rescue(async (req, res) => {
      res.status(204).end(await service.create(req.body))
    }),
    rescue.from(errors.DuplicatedTraceError, ({ message }) => {
      throw new ConflictHttpError({ code: 'DUPLICATED_TRACE', message })
    })
  ])
}
