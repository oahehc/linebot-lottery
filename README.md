# TODO
1. collect website information by lambda function, trigger interval
2. push collect result to Heroku
3. Heroku push line msg to user


---
# linebot-lottery
collect lottery information and using line message for auto alert


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
### (A) Create lineBot and use Heroku as lineBot webhook URL
1. [Create LineBot account](https://business.line.me/zh-hant/companies/1349954/entry/botapi_devtrial) and record below information
    ![linebot information](http://i.imgur.com/qTQoGrG.png)
2. [Create Heroku account](https://dashboard.heroku.com) and start an app
3. deploy to heroku
    ![heroku deploy](http://i.imgur.com/F5H1ONM.png)
4. add line information to Heroku Config Variables
    ![heroku config var](http://i.imgur.com/4SZbeiV.png)
5. Add heroku URL as webhook URL for lineBot, and click VERIFY button for check heroku is working successfully
    ![lineBot webhook](http://i.imgur.com/McyEI76.png)
6. Send a test message to lineBot, and use 'heroku logs --tail' to check line userId, add to Heroku Config Variables
    ![heroku config var for userId](http://i.imgur.com/ubmwYAt.png)

### (B) Create AWS lambda function for collect lottery data from offical website
1. 
```
'use strict';
const superagent = require('superagent');
const cheerio = require('cheerio');
const targetURL = 'http://www.taiwanlottery.com.tw/lotto/Lotto649/history.aspx';

exports.handler = (event, context, callback) => {
    superagent.get(targetURL)
        .end((err, sres) => {
            if (err) return next(err);
            const $ = cheerio.load(sres.text);
            const tableContent = {};
            const result = {};
            $('.table_org').each((index, element) => { // table_gre
                const $element = $(element);
                const tableArray = $element.text().split('\n').map(data => data.trim());
                tableContent[index] = tableArray;
                result[index] = {
                    date: tableArray[11],
                    number: tableArray.slice(33, 40).join('、'),
                    winner: tableArray[74],
                    accumulateAmount: tableArray[98],
                };
            });
            console.log(result);
            callback(null, result);
        });
};
```
2. adjust timeout to 10 sec
![lambda timeout](http://i.imgur.com/h1WJ1MO.png)


### Send collect data to Heroku, then push message to user through lineBot