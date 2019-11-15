const path = require('path');
const moment = require('moment');
const Base64 = require('js-base64').Base64;
const Constants = require('./Constants.js');
const utils = {};
utils.generateAuthorization = (options) => {
  options = options || {};
  const accessToken = options.accessToken;
  return {headers: {"Authorization": "Bearer " + accessToken}};
}

utils.resolveURL = (prefix, suffix, options) => {
  return path.join(prefix, suffix);
}

utils.getAuditField = function (url, method, params, redirectHeaders) {
  let userName, companyName;
  if (redirectHeaders) {
    let _redirectHeaders = typeof redirectHeaders == 'object' ? redirectHeaders : JSON.parse(Base64.decode(redirectHeaders));
    userName = _redirectHeaders && _redirectHeaders.username;
    companyName = _redirectHeaders && _redirectHeaders.companyName;
  }

  if (!Constants.ACTION_CATEGORY[method]) {
    return {}
  }

  let auditObject = {
    'category': (Constants.ACTION_CATEGORY[method] && Constants.ACTION_CATEGORY[method].category) || 'AuditRecord',
    'user': userName,
    'source': companyName,
    'event.time': moment(moment()).utc().format('YYYY-MM-DDThh:mm:ss.SSS'),
    'action': (Constants.ACTION_CATEGORY[method] && Constants.ACTION_CATEGORY[method].action)
  };

  if (method) {
    auditObject['impact'] = method;
  }
  auditObject['destination'] = url;
  auditObject['details'] = params;

  return auditObject
};

utils.loggerPrefFormat = function (actionAuthorization, options) {
  let str = '';
  if (Object.keys(actionAuthorization).length <= 1) {
    return str;
  }
  Object.keys(actionAuthorization).forEach(keyItem => [
    str += `<${keyItem}=${actionAuthorization[keyItem]}>`
  ]);
  return str;
};

module.exports = utils;
