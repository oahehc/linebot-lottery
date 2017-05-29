# linebot-lottery
collect lottery information and push by line message


---
# DIR Structure
```bash
├── heroku/               # create heroku app            
│   ├── node_modules/
│   ├── index.js
│   └── package.json
├── lambda/               # create AWS lambda function          
│   ├── node_modules/
│   ├── zip/              # zip node_modules/ + index.js, and upload to create lambda function
│   ├── index.js
│   └── package.json
```

---
# STEP
### (A) LineBot: use Heroku as webhook URL
1. [Create LineBot account](https://business.line.me/zh-hant/companies/1349954/entry/botapi_devtrial) and note below information
    ![linebot information](http://i.imgur.com/qTQoGrG.png)
2. [Create Heroku account](https://dashboard.heroku.com) and start an app
3. deploy to heroku
    ![heroku deploy](http://i.imgur.com/F5H1ONM.png)
    ```
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
        const msgArray = req.body.lineMsg;
        pushMsgToHost(msgArray);
        res.send('success');
    });
    app.listen(port, () => {
        console.log(`app is listening at port ${port}`);
    });
    ```
4. add line information to Heroku Config Variables
    ![heroku config var](http://i.imgur.com/4SZbeiV.png)
5. Add heroku URL as webhook URL for lineBot, and click VERIFY button for check heroku is working successfully
    ![lineBot webhook](http://i.imgur.com/McyEI76.png)
6. Send a test message to lineBot, and use 'heroku logs --tail' to check line userId, add to Heroku Config Variables
    ![heroku config var for userId](http://i.imgur.com/ubmwYAt.png)

### (B) AWS lambda: collect lottery data and send to Heroku
1. create lambda function by AWS console<br>
*upload zip file with index.js + node_modules/
```
'use strict';
const superagent = require('superagent');
const cheerio = require('cheerio');
const request = require('request');
const targetURL = 'http://www.taiwanlottery.com.tw/lotto/Lotto649/history.aspx';
const herokuURL = 'https://line-bot-oahehc-lottery.herokuapp.com/pushMsg';

exports.handler = (event, context, callback) => {
    // collect data from target website
    superagent.get(targetURL)
        .end((err, sres) => {
            if (err) return next(err);
            const $ = cheerio.load(sres.text);
            const tableContent = {};
            const result = {};
            $('table.td_hm').each((index, element) => { // table_gre
                const $element = $(element);
                const tableArray = $element.text().split('\n').map(data => data.trim());
                tableContent[index] = tableArray;
                result[index] = {
                    date: tableArray[11],
                    number: tableArray.slice(33, 40).join('、'),
                    winner: tableArray[74],
                    prize: tableArray[86],
                    accumulatePrize: tableArray[98],
                };
                // tableArray.forEach((data, index) => console.log(index, data));
            });
            console.log(result[0], result[1]);

            // send result to heroku
            const options = {
                method: 'POST',
                uri: herokuURL,
                headers: {
                    'Content-Type': 'application/json',
                },
                body: {
                    lineMsg: [{
                        type: "text",
                        text: `${result[1].date}\n${result[1].number}\n頭獎人數:${result[1].winner}\n頭獎獎金:${result[1].prize}\n累積獎金:${result[1].accumulatePrize}\n`,
                    }, {
                        type: "text",
                        text: `${result[0].date}\n${result[0].number}\n頭獎人數:${result[0].winner}\n頭獎獎金:${result[0].prize}\n累積獎金:${result[0].accumulatePrize}\n`,
                    }]
                },
                json: true
            };
            console.log('request option', options);
            request(options, (error, response, body) => {
                if (!error && response.statusCode == 200) {
                    console.log(body);
                } else {
                    console.log('STATUS', response.statusCode, error);
                }
            });
            callback(null, result);
        });
};
```
2. adjust timeout to 20 sec
![lambda timeout](http://i.imgur.com/ciV7ebg.png)


### (C) AWS cloudwatch: auto trigger lambda per week