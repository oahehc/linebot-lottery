const express = require('express');
const linebot = require('linebot');
const request = require('request');
const bodyParser = require('body-parser');

// parameter setting
const homepageUrl = 'https://line-bot-oahehc.herokuapp.com/';
// line
const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
});

// functions
function lineReply(event, msgObj) { // send line reply msg
    event.reply(msgObj).then((data) => {
        console.log('reply success', data);
    }).catch(error => console.log('reply fail', error));
}

function reportToHost(msgObjArray) { // send msg to host account
    const userId = process.env.HostUserId;
    const options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.channelAccessToken}`
        },
        body: {
            to: userId,
            messages: msgObjArray
        },
        json: true
    };
    console.log('request option', options);
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log('STATUS', response.statusCode);
            console.log('ERROR', error);
        }
    });
}

function pushMsg(userId, msgObj) { // push msg to user
    const options = {
        method: 'POST',
        uri: 'https://api.line.me/v2/bot/message/push',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${process.env.channelAccessToken}`
        },
        body: {
            to: userId,
            messages: msgObj
        },
        json: true
    };
    console.log('request option', options);
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) {
            console.log(body);
        } else {
            console.log('STATUS', response.statusCode);
            console.log('ERROR', error);
        }
    });
}

// line bot event
bot.on('follow', function (event) {
    console.log('follow', event);
    lineReply(event, { // Welcome msg
        type: 'text',
        text: '歡迎使用',
    });
});
bot.on('postback', function (event) {
    console.log('postback', event);
});
bot.on('message', function (event) {
    console.log('message', event);
});



// start express server
const path = require('path');
const app = express();
const linebotParser = bot.parser();
app.post('/', linebotParser);
const port = process.env.PORT || '3000';
app.set('port', port);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.post('/test', function (req, res) {
    console.log('req', req);
    console.log('body', req.body);
    console.log('msg', req.body.lineMsg);
    reportToHost(req.body.lineMsg);
    res.send('success');
    // res.end();
});

app.post('/pushMsg', (req, res, next) => {
    const password = req.body.password;
    const msgArray = req.body.lineMsg;
    if (password === process.env.password) { // check password

        res.send('success');
    } else {
        res.end();
    }
});
app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});