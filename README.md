# TODO
1. collect website information by lambda function, trigger interval
2. push collect result to Heroku
3. Heroku push line msg to user


---
# linebot-lottery
collect lottery information and auto alert by using line message

---
# STEP
### (A) Create lineBot and use Heroku as lineBot webhook URL
1. [Create LineBot account](https://business.line.me/zh-hant/companies/1349954/entry/botapi_devtrial)
2. [Create Heroku account]()


### (B) User AWS lambda function for collect lottery data from offical website
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

### Send collect data to Heroku, then push message to user through lineBot