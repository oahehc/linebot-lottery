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
            callback(null, result);
        });
};