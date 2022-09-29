const logger = require('./logger')
var morgan = require('morgan')

const requestLogger = (request, response, next) => {
  logger.info('Method:', request.method)
  logger.info('Path:  ', request.path)
  logger.info('Body:  ', request.body)
  logger.info('---')
  next()
}

const morganLogger = morgan(function (tokens, req, res) {
  return [
    tokens.method(req, res),
    tokens.url(req, res),
    tokens.status(req, res),
    tokens.res(req, res, 'content-length'), '-',
    tokens['response-time'](req, res), 'ms',
    JSON.stringify(req.body)
  ].join(' ')
})

const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

const errorHandler = (error, request, response, next) => {
  logger.error(error.message)
  if (error.name === 'CastError'){
    return response.status(400).send({error: 'malformed id'})
  }
  else if (error.name === 'ValidationError'){
    return response.status(400).json({error: error.message})
  }
  next(error)
}

module.exports = {
  requestLogger,
  morganLogger,
  unknownEndpoint,
  errorHandler
}