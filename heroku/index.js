const express = require('express');
const linebot = require('linebot');
const request = require('request');
const bodyParser = require('body-parser');
const path = require('path');

function pushMsgToHost(msgObjArray) {
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
    request(options, (error, response, body) => {
        if (!error && response.statusCode == 200) console.log(body);
        else console.log('STATUS', response.statusCode, error);
    });
}
// line bot event
const bot = linebot({
    channelId: process.env.channelId,
    channelSecret: process.env.channelSecret,
    channelAccessToken: process.env.channelAccessToken,
});
bot.on('follow', function (event) {
    console.log('follow', event);
});
bot.on('message', function (event) {
    console.log('message', event);
});
// start express server
const app = express();
const linebotParser = bot.parser();
const port = process.env.PORT || '3000';
app.set('port', port);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));
app.post('/', linebotParser);
app.post('/pushMsg', (req, res, next) => { // get msg then push by line
    const password = req.body.password;
    const msgArray = req.body.lineMsg;
    if (password == process.env.password) {
        pushMsgToHost(msgArray);
        res.send('success');
    } else {
        res.end();
    }
});
app.listen(port, () => {
    console.log(`app is listening at port ${port}`);
});