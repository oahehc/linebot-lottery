'use strict';
const superagent = require('superagent');
const cheerio = require('cheerio');
const request = require('request');
const targetURL = 'http://www.taiwanlottery.com.tw/lotto/Lotto649/history.aspx';
const herokuURL = 'https://line-bot-oahehc-lottery.herokuapp.com/pushMsg';
const targetNum = ['05', '06', '07', '08', '09', '10'];

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
                const matchNum = tableArray.slice(33, 40).reduce((count, num) => {
                    if (targetNum.indexOf(num) > -1) count += 1;
                    return count;
                }, 0);
                result[index] = {
                    date: tableArray[11],
                    number: tableArray.slice(33, 40).join('、'),
                    winner: tableArray[74],
                    prize: tableArray[86],
                    accumulatePrize: tableArray[98],
                    matchNum,
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
                    password: process.env.password,
                    lineMsg: [{
                        type: "text",
                        text: `${result[1].date}\n${result[1].number}\n頭獎人數:${result[1].winner}\n頭獎獎金:${result[1].prize}\n累積獎金:${result[1].accumulatePrize}\n對獎結果:${result[1].matchNum}`,
                    }, {
                        type: "text",
                        text: `${result[0].date}\n${result[0].number}\n頭獎人數:${result[0].winner}\n頭獎獎金:${result[0].prize}\n累積獎金:${result[0].accumulatePrize}\n對獎結果:${result[0].matchNum}`,
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