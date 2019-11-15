const nodeMailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const ejs = require('ejs');
const logger = require('log4js').getLogger(path.join(__filename));
const Constants = require('../common/Constants');
class MailSenter {
  constructor(mailSenter = {}) {
    this.to = mailSenter.to;
    this.cc = mailSenter.cc;
    this.subject = mailSenter.subject;
    this.html = mailSenter.html;
    this.text = mailSenter.text;
    this.htmlHeader = mailSenter.htmlHeader;
    this.htmlContent = mailSenter.htmlContent;
    this.htmlBtnDesc = mailSenter.htmlBtnDesc;
    this.htmlBtnText = mailSenter.htmlBtnText;
    this.htmlBtnLink = mailSenter.htmlBtnLink;
    this.htmlContentTips = mailSenter.htmlContentTips;
  }

  send(callback, options){
    const {to, cc, subject, text, htmlHeader, htmlContent, htmlBtnDesc, htmlBtnText, htmlBtnLink, htmlContentTips} = this;

    let mailTemplate = fs.readFileSync(path.join(__dirname, '../public/email_template/template.html'));
    let html = mailTemplate.toString();
    html = ejs.render(html, {content: {subject, htmlHeader, htmlContent, htmlBtnDesc, htmlBtnText, htmlBtnLink, htmlContentTips}});
    const {SERVICE: service, HOST: host, PORT: port, USER: user, PASSWORD: pass, SECURE: secure} = Constants.MAIL;
    let transporter = nodeMailer.createTransport({service, host, port, secure, auth: {user, pass}});
    let mailOptions = {from: user, to, cc, subject, text, html};
    transporter.sendMail(mailOptions, function(error, info){
      if(error) return logger.error(error);

      logger.info('Mail Message request : ', JSON.stringify(mailOptions));
      logger.info('Mail Sent To : [ '+ to + ' ], ' + info.response);

      callback && callback(error, info);
    });
  }
}

module.exports = MailSenter;
