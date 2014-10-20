'use strict';
var
    express = require('express'),
    app = express(),
    finalhandler = require('finalhandler'),
    serveStatic = require('serve-static'),
    bodyParser = require('body-parser'),
    request = require('request'),
    requestJson = require('request-json'),
    hlprs = require('./build/helpers.node.js'),
    serve,
    server,
    apiUri = 'https://api.sendhub.com/',
    apis = {};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

serve = serveStatic('build', {
    'index': ['index.html']
});

app.get(/(\.js|\.css)$/i, function(req, res) {
    var
        done = finalhandler(req, res);

    serve(req, res, done);
});

app.get('/', function(req, res) {
    var
        done = finalhandler(req, res);

    serve(req, res, done);
});

app.post('/login', function(req, res) {
    var
        number = req.param('NUMBER'),
        apikey = req.param('APIKEY'),
        solt = req.param('SOLT'),
        apiVer = 'v1',
        identity = '/?username=NUMBER&api_key=APIKEY',
        getContacts = apiUri + apiVer + '/contacts' + identity,
        addContact = apiVer + '/contacts' + identity,
        sendMessage = apiVer + '/messages' + identity,
        getContactsUri,
        addContactUri,
        sendMessageUri;

    if (hlprs.validateNumber(number) && apikey && solt) {


        getContactsUri = getContacts.replace(/NUMBER/g, number).replace(/APIKEY/g, apikey);
        addContactUri = addContact.replace(/NUMBER/g, number).replace(/APIKEY/g, apikey);
        sendMessageUri = sendMessage.replace(/NUMBER/g, number).replace(/APIKEY/g, apikey);

        apis[solt] = {
            number: number,
            apikey: apikey,
            getContactsUri: getContactsUri,
            addContactUri: addContactUri,
            sendMessageUri: sendMessageUri
        };
        request(apis[solt].getContactsUri, function(err, resp0, body) {

            if ( !err ) {

                res.send({
                    'resp': resp0.statusCode,
                    'body': hlprs.parseJson(body)
                });

            } else {

        		res.send({
        		    "resp": "011"
        		});
            }
        });

    } else {

        res.send({
            "resp": "010"
        });
    }
});

app.post('/save', function(req, res) {
    var
        number = req.param('NUMBER'),
        name = req.param('NAME'),
        solt = req.param('SOLT'),
        data = {
            "number": number,
            "name": name
        },
        client,
        api = apis[solt];

    if (hlprs.validateNumber(number) && name && solt && api) {

        client = requestJson.newClient(apiUri);
        client.post(
            api.addContactUri,
            data,
            function(err, resp0, body) {

                if (!err && resp0.statusCode === 201) {

                    request(api.getContactsUri, function(err, resp1, body) {

                        if (!err) {

                    		res.send({
                    		    "resp": resp0.statusCode,
                    		    'body': hlprs.parseJson(body)
                    		});
                        } else {

                            res.send({
                                "resp": '021'
                            });
                        }
                    });
                } else {

                    res.send({
                        "resp": resp0.statusCode,
                        'body': body
                    });
                }
            });

    } else {

        res.send({
            "resp": "020"
        });
    }
});

app.post('/send', function(req, res) {
    var
        text = req.param('MESSAGE'),
        contacts = req.param('CONTACTS'),
        solt = req.param('SOLT'),
        data = {
            "text": text,
            "contacts": contacts
        },
        client,
        api = apis[solt];

    if (text && contacts.length && solt && api) {

        client = requestJson.newClient(apiUri);
        client.post(
            api.sendMessageUri,
            data,
            function(err, resp0, body) {

                if (!err) {

                    res.send({
                        "resp": resp0.statusCode,
                        'body': body
                    });
                } else {
        			res.send({
        			    "resp": "031"
        			});
                }
            });

    } else {

        res.send({
            "resp": "030"
        });
    }
});

var server = app.listen(3000, function() {
    var
        host = server.address().address,
        port = server.address().port;

    console.log('SendHub example started at http://%s:%s', host, port);
});