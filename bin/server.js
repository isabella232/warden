#!/usr/bin/env node

/* global Config, Log */
'use strict';

const args = require('yargs')
  .usage('Usage: $0 [args]')
  .option('c', {
    alias: 'config',
    describe: 'Load configuration from file',
    type: 'string'
  })
  .help('help')
  .argv;

const express = require('express');
const expressWinston = require('express-winston');
const http = require('http');
const Path = require('path');
const Logger = require('../lib/logger');
const app = express();

// Load nconf into the global namespace
global.Config = require('nconf')
    .env()
    .argv();

if (args.c) {
  global.Config.file(Path.resolve(process.cwd(), args.c));
}
global.Config.defaults(require('../config/defaults.json'));

// Set up logging
global.Log = Logger.attach(global.Config.get('log:level'));

app.use(expressWinston.logger({
  winstonInstance: global.Log,
  expressFormat: true,
  level: global.Config.get('log:level'),
  baseMeta: {source: 'request', type: 'request'}
}));

// Register endpoints
require('../lib/control/v1/health').attach(app);

// Instantiate server and start it
const host = Config.get('service:hostname');
const port = Config.get('service:port');
const server = http.createServer(app);

server.on('error', (err) => global.Log.error(err));

server.listen(port, host, () => {
  Log.info(`Listening on ${host}:${port}`);
});