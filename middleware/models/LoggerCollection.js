const log4js = require('log4js');
const log4jsJSON = require('../../log4js.json');
const MailSenter = require('./MailSenter');

const EMAILES = [
  'hulinhai@derbysoft.net',
  'yuxiaoguang@derbysoft.net'
];

class LoggerCollection {
  constructor(loggerTagName) {
    this.logger = null;
    this.configure();
    this.getLogger(loggerTagName)
  }

  configure() {
    log4js.configure(log4jsJSON);
  }

  connectLogger(logger, options) {
    return log4js.connectLogger(logger, options)
  }

  getLogger(loggerTagName) {
    this.logger = log4js.getLogger(loggerTagName);
  }

  error(errorTagName, errorMsg) {
    this.logger.error(errorTagName, errorMsg);
    this._pushEmailMessage(errorTagName + JSON.stringify(errorMsg));
  }

  info(requestBody, responseBody) {
    this.logger.info(requestBody, responseBody);
  }

  trace(traceTagName, ...args) {
    this.logger.trace(traceTagName, ...args);
  }

  warn(warnTagName, ...args) {
    this.logger.warn(warnTagName, ...args);
  }

  fatal(fatalTagName, ...args) {
    this.logger.fatal(fatalTagName, ...args);
  }

  perf(perfStr) {
    if (!perfStr) return;
    this.logger.info(perfStr);
  }

}

module.exports = LoggerCollection;
