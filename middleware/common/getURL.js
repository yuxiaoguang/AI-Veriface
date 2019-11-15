const request = require('request');
const utils = require('./utils.js');

const LoggerCollection = require('../models/LoggerCollection');
const perfLogger = new LoggerCollection('perf');
const logger = new LoggerCollection(__filename);

const getURL = (url, callback, options = {headers: {}}) => {
  let _options = {
    url,
    method: 'GET'
  };
  if (options.headers) {
    Object.assign(_options, {
      headers: Object.assign(
        {'Authorization': options.headers['authorization']}
      ),
    })
  }
  let actionAuditField = utils.getAuditField(url, '', '', options.headers['redirect-headers']);
  logger.info('Request=' + JSON.stringify(_options));
  if(options.isBinaryStream === true) return request(_options);

  request(_options, (err, response, body) => {
    if(err) {
      logger.error('getURL ERROR: ', {errCode: err.errCode || 'Unknow Error Code', message: err});
      perfLogger.perf(utils.loggerPrefFormat({...actionAuditField, 'err.msg': err, status: 'Fail'}));
      return;
    }
    perfLogger.perf(utils.loggerPrefFormat({...actionAuditField, status: 'Success '}));
    if(typeof body === 'string'){
      body = JSON.parse(body);
    }
    callback(body);
  });
};

module.exports = getURL;
