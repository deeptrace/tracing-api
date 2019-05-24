'use strict'

const errors = require('../errors.js')
const rescue = require('express-rescue')
const { NotFoundHttpError } = require('@deeptrace/appify')

module.exports.register = (router, service) => {
  router.get('/traces/:id', [
    rescue(async (req, res) => {
      res.status(200).json(await service.inspect(req.params.id))
    }),
    rescue.from(errors.TraceNotFoundError, ({ message }) => {
      throw new NotFoundHttpError({ code: 'TRACE_NOT_FOUND', message })
    })
  ])
}
