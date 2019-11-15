const request = require('request');
const utils = require('./utils.js');

const LoggerCollection = require('../models/LoggerCollection');
const perfLogger = new LoggerCollection('perf');
const logger = new LoggerCollection(__filename);

const JSONRPC = (url, params, callback, options = {headers: {}}) => {
  let actionAuditField = utils.getAuditField(url, JSON.stringify(params), options.headers['redirect-headers']);
  options = {
    url: url,
    method: 'POST',
    headers: Object.assign(
      {'Content-Type': 'application/json'},
      {'access_token': options.headers['authorization']}
    ),
    body: JSON.stringify(params)
  };

  request(options, (err, response, body) => {
    if(err) {
      logger.error('JSONRPC ERROR: ', {errCode: err.errCode || 'Unknow Error Code', message: err});
      perfLogger.perf(utils.loggerPrefFormat({...actionAuditField, 'err.msg': err, status: 'Fail'}));
      return
    }
    perfLogger.perf(utils.loggerPrefFormat({...actionAuditField, status: 'Success '}));
      if(typeof body === 'string'){
          body = JSON.parse(body);
      }
    callback(body);
  });
};

module.exports = JSONRPC;
