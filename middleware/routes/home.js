const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const os = require('os');
const getURL = require('../common/getURL');
const getJSONRPC = require('../common/JSONRPC');
const Constants = require('../common/Constants');
const env = require('../../config/env');

const LoggerCollection = require('../models/LoggerCollection');
const logger = new LoggerCollection(__filename);

let accessToken = '';

// middleware that is specific to this router
router.use(function timeLog(req, res, next) {
  logger.info('Access to : ', req.baseUrl);
  next();
});

router.get('/', (req, res) => {
    res.render('index');
    res.end();
});

router.get('/status.ci', (req, res) => {
    res.send({
        result: {
            'os.hostname': os.hostname(),
            'os.type': os.type(),
            'os.platform': os.platform(),
            'os.arch': os.arch(),
            'os.release': os.release(),
            'os.uptime': os.uptime(),
            'os.loadavg': os.loadavg(),
            'os.totalmem': os.totalmem(),
            'os.freemem': os.freemem(),
            'os.cpus': os.cpus(),
            'os.networkInterfaces': os.networkInterfaces()
        }
    });
});

router.post('/access', function (req, res) {
    const {GRANT_TYPE: grant_type, CLIENT_ID: client_id, CLIENT_SECRET: client_secret} = Constants.AIP_CONFIG;
    let endpoint = [env.CLUSTER.AIPService, '/oauth/2.0/token', ['?grant_type='+ grant_type, 'client_id='+ client_id, 'client_secret='+ client_secret].join('&')].join('');

    getURL(endpoint, (tokenCluster) => {
        let {refresh_token, expires_in, session_key, access_token, scope, session_secret} = tokenCluster;
        accessToken = access_token;
        res.send({refresh_token, expires_in, session_key, access_token, scope, session_secret});
    })
});

router.post('/match', function (req, res) {
    let endpoint = [env.CLUSTER.AIPService, '/rest/2.0/face/v3/match', '?access_token=' + accessToken].join('');
    const bitMap = fs.readFileSync(path.join(__dirname, '../public/images/005.png'));
    const base64Str = new Buffer(bitMap).toString('base64');
    const params = [
        {
            image: base64Str,
            image_type: "BASE64",
        }, {
            image: req.body.img.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
            image_type: "BASE64",
        }
    ];

    console.log(req.body.card_number)

    getJSONRPC(endpoint, params, (compareResult) => {
        res.send(compareResult);
    })
});

router.post('/detect', function (req, res) {
    let endpoint = [env.CLUSTER.AIPService, '/rest/2.0/face/v3/detect', '?access_token=' + accessToken].join('');
    const params = {
        image: req.body.img.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
        image_type: 'BASE64',
        face_field: 'age,beauty,expression,face_shape,gender,glasses,landmark,landmark150,race,quality,eye_status,emotion,face_type'
    }
    getJSONRPC(endpoint, params, (compareResult) => {
        res.send(compareResult);
    })
});

router.post('/add', function (req, res) {
    let endpoint = [env.CLUSTER.AIPService, '/rest/2.0/face/v3/faceset/user/add', '?access_token=' + accessToken].join('');
    const params = {
        image: req.body.img.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
        image_type: 'BASE64',
        group_id: req.body.group_id,
        user_id: req.body.user_id,
        user_info: req.body.user_info,
        quality_control: 'LOW',
        liveness_control: 'HIGH'
    }
    getJSONRPC(endpoint, params, (compareResult) => {
        res.send(compareResult);
    })
});

router.post('/search', function (req, res) {
    let endpoint = [env.CLUSTER.AIPService, '/rest/2.0/face/v3/search', '?access_token=' + accessToken].join('');
    const params = {
        image: req.body.img.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
        image_type: 'BASE64',
        group_id_list: req.body.group_id_list,
        quality_control: 'LOW',
        liveness_control: 'HIGH'
    }
    getJSONRPC(endpoint, params, (compareResult) => {
        res.send(compareResult);
    })
});

module.exports = router;
