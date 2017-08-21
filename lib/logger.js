'use strict';

const Winston = require('winston');
const expressWinston = require('express-winston');

/**
 * Create an instance of Winston.Logger
 * @param {string} level
 * @return {LoggerInstance}
 * @constructor
 */
function Logger(level) {
  const logLevel = level.toUpperCase() || 'INFO';

  const javaLogLevels = {
    levels: {
      ERROR: 0,
      WARN: 1,
      INFO: 2,
      VERBOSE: 3,
      DEBUG: 4,
      SILLY: 5
    },
    colors: {
      ERROR: 'red',
      WARN: 'yellow',
      INFO: 'green',
      DEBUG: 'blue'
    }
  };

  const logger = new Winston.Logger({
    level: logLevel,
    levels: javaLogLevels.levels,
    colors: javaLogLevels.colors,
    transports: [
      new Winston.transports.Console({
        timestamp: true,
        json: Config.get('log:json'),
        stringify: Config.get('log:json'),
        colorize: !Config.get('log:json')
      })
    ]
  });

  return logger;
}


/**
 * Generates middleware for Express to log incoming requests
 * @param {Winston.Logger} logger
 * @param {string} level
 * @returns {expressWinston.logger}
 * @constructor
 */
function RequestLogger(logger, level) {
  const logLevel = level.toUpperCase() || 'INFO';

  return expressWinston.logger({
    winstonInstance: logger,
    expressFormat: false,
    msg: '{{req.method}} {{req.url}} {{res.statusCode}} {{res.responseTime}}ms',
    level: logLevel,
    baseMeta: {sourceName: 'request'}
  });
}

exports.attach = Logger;
exports.requests = RequestLogger;
