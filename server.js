var https = require('https')
var qs = require('querystring')
var path = require('path')

var express = require('express')
var app = express()
var fs = require('fs')
var bodyParser = require('body-parser')

var access_token = ''

const param = qs.stringify({
    'grant_type': 'client_credentials',
    'client_id': 'j0gZXDbA93vZOnnI56T3w8oA',
    'client_secret': 'ESEgs6t15Ex7HAG1hfz8f4s76d9yfgnF'
})

var bitmap = fs.readFileSync('./images/005.png')

var base64str1 = new Buffer(bitmap).toString('base64')


app.use(bodyParser.urlencoded({limit: '50mb', extended: true }))


app.use(express.static('faceid'))

app.post('/access', function (req, res) {
    https.get(
        {
            hostname: 'aip.baidubce.com',
            path: '/oauth/2.0/token?' + param,
            agent: false
        },
        function (res) {
            res.setEncoding('utf8')
            res.on('data',function (data) {
                access_token = JSON.parse(data).access_token
            })
        }
    )
})


app.post('/judge', function (req, res) {
    let  options = {
        host: 'aip.baidubce.com',
        path: '/rest/2.0/face/v3/match?access_token="'+access_token+'"',
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        }
    }
    let contents = JSON.stringify([
        {
            image: base64str1,
            image_type: "BASE64",
        }, {
            image: req.body.img.replace(/\s/g, "+").replace(/^data:image\/\w+\Wbase64,/, ""),
            image_type: "BASE64",
        }
    ])

    let req_baidu = https.request(options, function (res_baidu) {
        res_baidu.setEncoding('utf8')
        res_baidu.on('data', function (chunk) {
            res.send(chunk)
        })

    })
    req_baidu.write(contents)
    req_baidu.end()

})

var server = app.listen(3302, function () {
    console.log('listening at http://%s','localhost:3302');
})
