const ACTION_CATEGORY = {};

const MAIL = {
  'SERVICE': 'Gmail',
    'HOST': 'smtp.gmail.com',
    'PORT': 587,
    'USER': 'go.noreply@derbysoft.net',
    'PASSWORD': 'Hp3k4R0lkYaU',
    'SECURE': false, // true for 465, false for other ports
};
const AIP_CONFIG = {
    GRANT_TYPE: 'client_credentials',
    CLIENT_ID: 'j0gZXDbA93vZOnnI56T3w8oA',
    CLIENT_SECRET: 'ESEgs6t15Ex7HAG1hfz8f4s76d9yfgnF'
};

module.exports = {
  ACTION_CATEGORY,
  MAIL,
  AIP_CONFIG
};
