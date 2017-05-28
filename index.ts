
const linebot = require('linebot');
const express = require('express');
const path = require('path');

// const bot = linebot({
//     channelId: process.env.channelId,
//     channelSecret: process.env.channelSecret,
//     channelAccessToken: process.env.channelAccessToken,
// });
// bot.on('follow', function (event) {
//     event.source.profile().then((data) => {
//         console.log('FOLLOW: profile', data);
//     });
// });

const app = express();
// const linebotParser = bot.parser();
// app.post('/', linebotParser);
const port = process.env.PORT || '3000';
app.set('port', port);
app.listen(port, () => {
    console.log('app is listening at port 3000');
});