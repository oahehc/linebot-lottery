var express = require('express');
var linebot = require('linebot');
var request = require('request');

// parameter setting
var homepageUrl = 'https://line-bot-oahehc.herokuapp.com/';
// line
var bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
});

// functions
function lineReply(event, msgObj) { // send line reply msg
    event.reply(msgObj).then(function (data) {
        console.log('reply success', data);
    }).catch(function (error) {
        console.log('reply fail', error);
    });
}

function reportToHost(msgObjArray) { // send msg to host account
    var passwordArray = JSON.parse(process.env.HostUserId);
    var userId = passwordArray[0];
    var options = {
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
    var options = {
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
var path = require('path');
var app = express();
var linebotParser = bot.parser();
app.post('/', linebotParser);
var port = process.env.PORT || '3000';
app.set('port', port);

app.post('/lottery', (req, res, next) => {
    var password = req.query.q;
    var passwordArray = JSON.parse(process.env.HostUserId);
    if (passwordArray.indexOf(password) > -1) { // check password
        fs.readFile(dataFile, function (err, content) {
            if (err) {
                console.log('Error loading client secret file: ' + err);
                return;
            }
            var data = JSON.parse(content);
            res.send(data);
        });
    } else {
        res.end();
    }
});
app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});