console.log('test');

// var express = require('express');
// var linebot = require('linebot');
// var request = require('request');
// var fs = require('fs');
// var uuidV4 = require('uuid/v4');

// // parameter setting
// var botName = "_餐廳搜尋助手_";
// var maxSearchNumber = 5;
// var homepageUrl = 'https://line-bot-oahehc.herokuapp.com/';
// var tempResult = {}; // temperately save for user to collect info 
// var dataFile = './data/data.json';
// // var hostFile = './data/info.json';
// // line
// var bot = linebot({
//     channelId: process.env.channelId,
//     channelSecret: process.env.channelSecret,
//     channelAccessToken: process.env.channelAccessToken,
// });
// // google
// var googleKey = process.env.apikey;
// var locationOptions = {
//     url: 'https://maps.googleapis.com/maps/api/place/nearbysearch/json',
//     method: 'GET',
//     qs: {
//         'key': googleKey,
//         'types': 'food',
//         'language': 'zh-TW',
//         'location': '',
//         'radius': '',
//         'name': '',
//     },
// };
// var detailOptions = {
//     url: 'https://maps.googleapis.com/maps/api/place/details/json',
//     method: 'GET',
//     qs: {
//         'key': googleKey,
//         'placeid': '',
//     },
// };
// var location = {
//     TW: {
//         CENTER: '23.771177,120.902964',
//         RAIDUS: 250000,
//     },
//     TP: {
//         CENTER: '25.06401,121.572885',
//         RAIDUS: 40000,
//     },
//     KL: {
//         CENTER: '25.117500,121.710355',
//         RAIDUS: 10000,
//     },
//     TY: {
//         CENTER: '24.983765,121.239375',
//         RAIDUS: 30000,
//     },
//     HS: {
//         CENTER: '24.781827,121.055435',
//         RAIDUS: 30000,
//     },
//     ML: {
//         CENTER: '24.495363,120.850406',
//         RAIDUS: 30000,
//     },
//     TC: {
//         CENTER: '24.212518,120.699271',
//         RAIDUS: 30000,
//     },
//     CW: {
//         CENTER: '23.979367,120.493071',
//         RAIDUS: 30000,
//     },
//     NT: {
//         CENTER: '23.866918,120.965222',
//         RAIDUS: 50000,
//     },
//     YL: {
//         CENTER: '23.721125,120.379426',
//         RAIDUS: 30000,
//     },
//     CY: {
//         CENTER: '23.496757,120.336077',
//         RAIDUS: 30000,
//     },
//     TN: {
//         CENTER: '23.142792,120.271640',
//         RAIDUS: 30000,
//     },
//     KS: {
//         CENTER: '22.768446,120.374740',
//         RAIDUS: 30000,
//     },
//     PT: {
//         CENTER: '22.474427,120.656248',
//         RAIDUS: 60000,
//     },
//     TT: {
//         CENTER: '22.855321,121.032776',
//         RAIDUS: 60000,
//     },
//     WL: {
//         CENTER: '23.813906,121.433189',
//         RAIDUS: 60000,
//     },
//     EL: {
//         CENTER: '24.599218,121.676786',
//         RAIDUS: 40000,
//     },

// };
// var locationType = {
//     '台北': 'TP',
//     '新北': 'TP',
//     '基隆': 'KL',
//     '桃園': 'TY',
//     '新竹': 'HS',
//     '苗栗': 'ML',
//     '台中': 'TC',
//     '彰化': 'CW',
//     '南投': 'NT',
//     '雲林': 'YL',
//     '嘉義': 'CY',
//     '台南': 'TN',
//     '高雄': 'KS',
//     '屏東': 'PT',
//     '台東': 'TT',
//     '花蓮': 'WL',
//     '宜蘭': 'EL',
// }

// function googlePromise(options) { // promise for google api request
//     // console.log('promise options', options);
//     return new Promise((resolve, reject) => {
//         request(options, (error, response, body) => {
//             if (!error && response.statusCode === 200) {
//                 var resultObj = JSON.parse(body);
//                 // console.log(resultObj);
//                 resolve(resultObj);
//             } else {
//                 // console.log('STATUS', response.statusCode);
//                 // console.log('ERROR', error);
//                 reject(new Error(error));
//             }
//         });
//     });
// }

// function createReply(resultObj, queryType) { // create line reply msg
//     return new Promise((resolve, reject) => {
//         if (queryType === 'template') { // create template msg
//             var msgArray = {
//                 "type": "template",
//                 "altText": "...",
//                 "template": {
//                     "type": "carousel",
//                     "columns": [],
//                 }
//             }
//             var placeIdArray = [];
//             resultObj.results.forEach((obj, index) => {
//                 if (index < maxSearchNumber) {
//                     // console.log(index, 'googleMap return', obj);
//                     var msgObj = {
//                         "thumbnailImageUrl": "https://example.com/bot/images/item1.jpg",
//                         "title": obj.name.substring(0, 40), // max 40 char
//                         "text": obj.vicinity.substring(0, 60), // max 60 char
//                         "actions": [{
//                             "type": "uri",
//                             "label": "顯示地圖",
//                             "uri": 'https://www.google.com/maps/place/' + obj.vicinity.replace(/ /g, '') + '/@' + obj.geometry.location.lat + ',' + obj.geometry.location.lng,
//                         }]
//                     };
//                     // console.log(index, 'msg create', msgObj);
//                     if (obj.rating && msgObj.title.length < 32) msgObj.title += '★' + obj.rating.toFixed(1); // title maxLength = 40
//                     // console.log(index, 'add rating');
//                     // console.log('uri', msgObj.actions[0].uri);
//                     // console.log('photo number', obj.photos.length);
//                     if (obj.photos && obj.photos.length > 0) { // obj.hasOwnProperty('photos') &&
//                         msgObj.thumbnailImageUrl = 'https://maps.googleapis.com/maps/api/place/photo?maxwidth=400&photoreference=' + obj.photos[0].photo_reference + '&sensor=false&key=' + process.env.apikey;
//                         // console.log('IMAGE', msgObj.thumbnailImageUrl);
//                     }
//                     // console.log(index, 'add photo');
//                     placeIdArray.push(obj.place_id);
//                     msgArray.template.columns.push(msgObj);
//                 }
//             });
//             var promiseDetailArray = placeIdArray.map((placeId) => {
//                 detailOptions.qs.placeid = placeId;
//                 return googlePromise(detailOptions);
//             });
//             Promise.all(promiseDetailArray).then((dataArray) => {
//                 dataArray.forEach((dataObj, index) => {
//                     // console.log(index, dataObj.result.name);
//                     // console.log(dataObj.result.international_phone_number);
//                     if (dataObj.result.formatted_phone_number) {
//                         // console.log(index, dataObj.result.formatted_phone_number);
//                         msgArray.template.columns[index].actions.push({
//                             "type": "uri",
//                             "label": "電話訂位",
//                             "uri": "tel:" + dataObj.result.formatted_phone_number.replace(/ /g, '').replace(/#/g, ','),
//                         });
//                     } else {
//                         msgArray.template.columns[index].actions.push({
//                             "type": "uri",
//                             "label": "暫無電話資訊",
//                             "uri": "tel:99999999",
//                         });
//                     }
//                     // console.log(index, 'msgAction', msgArray.template.columns[index]);
//                 });
//                 // console.log('msg', msgArray);
//                 msgArray.template.columns.forEach((columnObj) => { // add collect btn
//                     var randomId = uuidV4();
//                     // save query result to global var
//                     tempResult[randomId] = JSON.parse(JSON.stringify(columnObj));
//                     columnObj.actions.push({
//                         "type": "postback",
//                         "label": "收藏",
//                         "data": `action=collect&data=${randomId}`,
//                     })
//                 })
//                 resolve(msgArray);
//             });
//         } else { // create location msg
//             var msgArray = [];
//             resultObj.results.forEach((obj, index) => {
//                 // console.log(index, 'googleMap return', obj);
//                 if (index < maxSearchNumber) {
//                     msgArray.push({
//                         type: 'location',
//                         title: obj.name,
//                         address: obj.vicinity,
//                         latitude: obj.geometry.location.lat,
//                         longitude: obj.geometry.location.lng,
//                     });
//                 }
//             });
//             // console.log('msg', msgArray);
//             resolve(msgArray);
//         }
//     });
// }

// function lineReply(event, msgObj) { // send line reply msg
//     event.reply(msgObj).then(function (data) {
//         console.log('reply success', data);
//     }).catch(function (error) {
//         console.log('reply fail', error);
//     });
// }

// function reportToHost(msgObjArray) { // send msg to host account
//     var passwordArray = JSON.parse(process.env.HostUserId);
//     var userId = passwordArray[0];
//     var options = {
//         method: 'POST',
//         uri: 'https://api.line.me/v2/bot/message/push',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.channelAccessToken}`
//         },
//         body: {
//             to: userId,
//             messages: msgObjArray
//         },
//         json: true
//     };
//     console.log('request option', options);
//     request(options, (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         } else {
//             console.log('STATUS', response.statusCode);
//             console.log('ERROR', error);
//         }
//     });
// }

// function pushMsg(userId, msgObj) { // push msg to user
//     var options = {
//         method: 'POST',
//         uri: 'https://api.line.me/v2/bot/message/push',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.channelAccessToken}`
//         },
//         body: {
//             to: userId,
//             messages: msgObj
//         },
//         json: true
//     };
//     console.log('request option', options);
//     request(options, (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         } else {
//             console.log('STATUS', response.statusCode);
//             console.log('ERROR', error);
//         }
//     });
// }

// function msgPushTest(event, msgObj) { // for msg push test
//     var options = {
//         method: 'POST',
//         uri: 'https://api.line.me/v2/bot/message/push',
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${process.env.channelAccessToken}`,
//         },
//         body: {
//             to: event.source.userId,
//             messages: [msgObj],
//         },
//         json: true,
//     };
//     console.log('request option', options);
//     request(options, (error, response, body) => {
//         if (!error && response.statusCode == 200) {
//             console.log(body);
//         } else {
//             console.log('STATUS', response.statusCode);
//             console.log('ERROR', error);
//         }
//     });
// }

// function getUrlVars(url) { // translate postback data to json format
//     var hash;
//     var myJson = {};
//     var hashes = url.slice(url.indexOf('?') + 1).split('&');
//     for (var i = 0; i < hashes.length; i++) {
//         hash = hashes[i].split('=');
//         myJson[hash[0]] = hash[1];
//     }
//     return myJson;
// }

// function getDate() { // show now with YYYYMMDD_HHMMSS
//     var now = new Date();
//     return now.getFullYear() + ('0' + (now.getMonth() + 1)).slice(-2) + ('0' + now.getDate()).slice(-2) + '_' + ('0' + now.getHours()).slice(-2) + ('0' + now.getMinutes()).slice(-2) + ('0' + now.getSeconds()).slice(-2);
// }

// function showDataSize(currentData) { // console DB size for debug
//     Object.keys(currentData).forEach((userId) => {
//         console.log(userId, currentData[userId].collection.length);
//     });
// };

// function uploadFile(auth, fileObj) { // upload file to google driver
//     console.log('uploadFile', fileObj);
//     var fileMetadata = {
//         'name': fileObj.name,
//         parents: [fileObj.folderId]
//     };
//     var media = {
//         mimeType: fileObj.type,
//         body: fs.createReadStream(fileObj.path),
//     };
//     drive.files.create({
//         auth: auth,
//         resource: fileMetadata,
//         media: media,
//         fields: 'id',
//     }, (err, file) => {
//         if (err) {
//             console.log(err);
//         } else {
//             console.log('File Id: ', file.id);
//         }
//     });
// }

// // google drive setting
// var google = require('googleapis');
// var OAuth2 = google.auth.OAuth2;
// var oauth2Client = new OAuth2(process.env.YOUR_CLIENT_ID, process.env.YOUR_CLIENT_SECRET, process.env.YOUR_REDIRECT_URL);
// var drive = google.drive('v3');
// var token = JSON.parse(process.env.DriverToken);
// var folderId = process.env.DriverFolderId;
// oauth2Client.setCredentials(token);
// // initial DB base on google drive data
// drive.files.list({ // get data list
//     auth: oauth2Client,
//     q: "mimeType='application/json' and name contains 'data'", // parents in ['0B_mgLbDfEkr8WkYwZWtXUHhuSnc']
//     fields: 'nextPageToken, files(id, name)',
//     spaces: 'drive',
// }, (err, res) => {
//     if (err) {
//         console.log(err);
//     } else {
//         if (res.files.length > 0) {
//             res.files.forEach((file) => {
//                 console.log('Google File List');
//                 console.log(file.name, file.id);
//             });
//             drive.files.get({
//                 auth: oauth2Client,
//                 fileId: res.files[0].id, // use last data to initial DB
//                 alt: 'media'
//             }, (err, response) => {
//                 if (err) {
//                     console.log('Get goole file error: ' + err);
//                     return;
//                 }
//                 console.log(response);
//                 fs.writeFile(dataFile, JSON.stringify(response), (err) => {
//                     if (err) throw err;
//                     console.log("initial DB from google drive");
//                 });
//             });
//         }
//     }
// });

// // line bot event
// bot.on('message', function (event) {
//     console.log('source', event.source); // source type: user | room | group
//     event.source.profile().then((data) => {
//         console.log('MESSAGE: profile', data);
//     });
//     // console.log('message type', event.message.type); // message type: Text | Image | Video | Audio | Location | Sticker
//     // console.log('message text', event.message.text);
//     /** Search Logic
//      *  name @ user : search and return template msg
//      *  name[LOCATION] @ user : search and indicate county
//      *  +++name @ user : search and return location msg
//      *  ***err xxxxxxx @ user : error report
//      *  +++list @ user : show homepage link
//      *  ===name @ group/room : search and return template msg
//      *  ---remove @ group/room : template msg for confirm remove bot from group room
//      */
//     if (event.message.type === 'text') {
//         if (event.message.text.toLowerCase() === '---remove' && event.source.type !== 'user') { // remove robot
//             console.log('remove bot from room/group');
//             var btnMsg = {
//                 "type": "template",
//                 "altText": "...",
//                 "template": {
//                     "type": "confirm",
//                     "text": "確定移除" + botName + "嗎?",
//                     "actions": [{
//                         "type": "postback",
//                         "label": "移除",
//                         "data": "remove",
//                     }, {
//                         "type": "postback",
//                         "label": "取消",
//                         "data": "cancel",
//                     }]
//                 }
//             };
//             lineReply(event, btnMsg);
//         } else if (event.message.text.toLowerCase() === '+++help' && event.source.type === 'user') { // home page link
//             var msg = {
//                 'type': 'text',
//                 'text': `操作方式介紹\n${homepageUrl}`,
//             };
//             lineReply(event, msg);
//         } else if (event.message.text.toLowerCase() === '+++list' && event.source.type === 'user') { // list collection
//             fs.readFile(dataFile, (err, content) => {
//                 if (err) {
//                     console.log('Error loading info file: ', err);
//                     return;
//                 }
//                 var currentData = JSON.parse(content);
//                 // console.log('currentData', currentData);
//                 if (currentData.hasOwnProperty(event.source.userId)) {
//                     if (currentData[event.source.userId].collection.length === 0) {
//                         lineReply(event, {
//                             "type": "text",
//                             "text": "目前無收藏資料"
//                         });
//                     } else if (currentData[event.source.userId].collection.length <= 5) {
//                         // console.log('collection', currentData[event.source.userId].collection);
//                         var msgArray = {
//                             "type": "template",
//                             "altText": "...",
//                             "template": {
//                                 "type": "carousel",
//                                 "columns": currentData[event.source.userId].collection,
//                             }
//                         }
//                         msgArray.template.columns.forEach((columnObj) => { // add delete btnMsg
//                             columnObj.actions.push({
//                                 "type": "postback",
//                                 "label": "取消收藏",
//                                 "data": `action=delete&data=${columnObj.UUID}`,
//                             })
//                         })
//                         lineReply(event, msgArray);
//                     } else { // collection more then 5, use push to send msg
//                         var msgArray = {
//                             "type": "template",
//                             "altText": "...",
//                             "template": {
//                                 "type": "carousel",
//                                 "columns": [],
//                             }
//                         }
//                         currentData[event.source.userId].collection.forEach((columnObj, index) => {
//                             // delete columnObj["UUID"];
//                             columnObj.actions.push({
//                                 "type": "postback",
//                                 "label": "取消收藏",
//                                 "data": `action=delete&data=${columnObj.UUID}`,
//                             });
//                             msgArray.template.columns.push(columnObj);
//                             if (msgArray.template.columns.length === 5) { // push msg for every 5 obj data
//                                 var newMsg = JSON.parse(JSON.stringify(msgArray));
//                                 pushMsg(event.source.userId, [newMsg]);
//                                 msgArray.template.columns = [];
//                             }
//                         });
//                         if (msgArray.template.columns.length !== 0) { // push remain msg
//                             pushMsg(event.source.userId, [msgArray]);
//                         }
//                     }
//                 } else {
//                     lineReply(event, {
//                         "type": "text",
//                         "text": "目前無收藏資料"
//                     });
//                 }
//             });
//         } else if (event.message.text.toLowerCase().indexOf('***err') === 0) { // err report
//             event.source.profile().then((data) => {
//                 console.log('ERR Report: profile', data);
//                 reportToHost([{
//                     "type": "text",
//                     "text": `ERROR\n${data.displayName}\n${event.message.text}`,
//                 }]);
//             });
//             lineReply(event, {
//                 "type": "text",
//                 "text": "已收到您的訊息，將會盡快處理，感謝。",
//             });
//         } else {
//             var searchKeyword = event.message.text;
//             var queryType = 'template';
//             var startSearch = false;
//             if (event.source.type === 'user') {
//                 startSearch = true;
//                 if (searchKeyword.indexOf('+++') === 0) {
//                     queryType = 'location';
//                     console.log('change return type to location');
//                     searchKeyword = searchKeyword.replace(/\+\+\+/, '');
//                 };
//             } else if (searchKeyword.indexOf('===') === 0) { // source = room | group
//                 startSearch = true;
//                 searchKeyword = searchKeyword.replace(/===/, '');
//             }
//             if (startSearch) {
//                 // check location input
//                 var start = searchKeyword.indexOf('[');
//                 var end = searchKeyword.indexOf(']');
//                 var locationName = 'TP';
//                 console.log('locationChar', start, end);
//                 if (start < end && start > -1 && end > -1) {
//                     var county = searchKeyword.substring(start + 1, end);
//                     console.log('indicate location', county);
//                     if (locationType.hasOwnProperty(county)) {
//                         console.log('adjust to new location', county);
//                         locationName = locationType[county];
//                         searchKeyword = searchKeyword.substring(0, start);
//                     }
//                 }
//                 // adjust location query name by message
//                 locationOptions.qs.name = searchKeyword;
//                 locationOptions.qs.location = location[locationName].CENTER;
//                 locationOptions.qs.radius = location[locationName].RAIDUS;
//                 var locationPromise = googlePromise(locationOptions);
//                 locationOptions.qs.location = location.TW.CENTER;
//                 locationOptions.qs.radius = location.TW.RAIDUS;
//                 var locationPromiseTw = googlePromise(locationOptions);

//                 // get restaurant information
//                 locationPromise.then((dataTp) => {
//                     if (dataTp.results.length > 0) {
//                         createReply(dataTp, queryType).then(replyMsg => lineReply(event, replyMsg));
//                     } else {
//                         locationPromiseTw.then((dataTw) => {
//                             if (dataTw.results.length > 0) {
//                                 console.log('no result for county, search whole taiwan');
//                                 createReply(dataTw, queryType).then(replyMsg => lineReply(event, replyMsg));
//                             } else {
//                                 lineReply(event, {
//                                     type: 'text',
//                                     text: '查無資料',
//                                 });
//                             }
//                         });
//                     }
//                 }).catch((err) => {
//                     console.log('ERROR', err);
//                 });
//             }
//         }
//     }
// });

// bot.on('follow', function (event) {
//     lineReply(event, { // Welcome msg
//         type: 'text',
//         text: '歡迎使用' + botName + '\n請輸入餐廳名稱搜尋相關資訊',
//     });
//     event.source.profile().then((data) => { // alert to manage account
//         console.log('FOLLOW: profile', data);
//         reportToHost([{
//             "type": "text",
//             "text": `NEW USER\n${data.displayName}\n${data.pictureUrl}`,
//         }]);
//     });
// });
// bot.on('unfollow', function (event) {
//     event.source.profile().then((data) => { // alert to manage account
//         console.log('UNFOLLOW: profile', data);
//         reportToHost([{
//             "type": "text",
//             "text": `USER UNFOLLOW\n${data.displayName}\n${data.pictureUrl}`,
//         }]);
//     });
// });
// bot.on('join', function (event) {
//     lineReply(event, {
//         type: 'text',
//         text: '操作方式介紹\n\n ===餐廳名稱 \n  :搜尋餐廳資訊\n ---remove \n  :移除' + botName,
//     });
// });
// bot.on('postback', function (event) {
//     console.log('postback', event);
//     var stickerList = {
//         cancel: [{
//             "stickerId": "2",
//             "packageId": "1",
//         }, {
//             "stickerId": "4",
//             "packageId": "1",
//         }, {
//             "stickerId": "5",
//             "packageId": "1",
//         }, {
//             "stickerId": "13",
//             "packageId": "1",
//         }, {
//             "stickerId": "14",
//             "packageId": "1",
//         }, {
//             "stickerId": "106",
//             "packageId": "1",
//         }, {
//             "stickerId": "114",
//             "packageId": "1",
//         }, {
//             "stickerId": "125",
//             "packageId": "1",
//         }, {
//             "stickerId": "137",
//             "packageId": "1",
//         }, {
//             "stickerId": "144",
//             "packageId": "2",
//         }, {
//             "stickerId": "171",
//             "packageId": "2",
//         }, {
//             "stickerId": "172",
//             "packageId": "2",
//         }, {
//             "stickerId": "176",
//             "packageId": "2",
//         }, ],
//         remove: [{
//             "stickerId": "3",
//             "packageId": "1",
//         }, {
//             "stickerId": "8",
//             "packageId": "1",
//         }, {
//             "stickerId": "9",
//             "packageId": "1",
//         }, {
//             "stickerId": "16",
//             "packageId": "1",
//         }, {
//             "stickerId": "17",
//             "packageId": "1",
//         }, {
//             "stickerId": "108",
//             "packageId": "1",
//         }, {
//             "stickerId": "113",
//             "packageId": "1",
//         }, {
//             "stickerId": "123",
//             "packageId": "1",
//         }, {
//             "stickerId": "131",
//             "packageId": "1",
//         }, {
//             "stickerId": "135",
//             "packageId": "1",
//         }, {
//             "stickerId": "403",
//             "packageId": "1",
//         }, {
//             "stickerId": "25",
//             "packageId": "2",
//         }, {
//             "stickerId": "152",
//             "packageId": "2",
//         }, {
//             "stickerId": "173",
//             "packageId": "2",
//         }, {
//             "stickerId": "524",
//             "packageId": "2",
//         }, ],
//     }
//     if (event.postback.data === 'cancel') { // cancel remove
//         var randomStick = stickerList.cancel[Math.floor(Math.random() * stickerList.cancel.length)];
//         console.log('sticker', randomStick);
//         var stickMsg = {
//             "type": "sticker",
//             "stickerId": randomStick.stickerId,
//             "packageId": randomStick.packageId,
//         };
//         lineReply(event, stickMsg);
//     } else if (event.postback.data === 'remove') { // remove from group/room
//         var randomStick = stickerList.remove[Math.floor(Math.random() * stickerList.cancel.length)];
//         console.log('sticker', randomStick);
//         var stickMsg = {
//             "type": "sticker",
//             "stickerId": randomStick.stickerId,
//             "packageId": randomStick.packageId,
//         };
//         lineReply(event, stickMsg);
//         var type = event.source.type;
//         var id = (type === 'room') ? event.source.roomId : event.source.groupId;
//         var leaveOptions = {
//             method: 'POST',
//             uri: `https://api.line.me/v2/bot/${type}/${id}/leave`,
//             headers: {
//                 'Authorization': `Bearer ${process.env.channelAccessToken}`,
//             },
//         };
//         console.log('leaveOptions', leaveOptions);
//         request(leaveOptions, (error, response, body) => {
//             console.log('STATUS', response.statusCode);
//             // console.log('ERROR', error);
//             // console.log('response', response);
//             // console.log('body', body);
//         });
//     } else {
//         var postbackData = getUrlVars(event.postback.data);
//         console.log('postbackData', postbackData);
//         console.log('tempResult', tempResult);
//         console.log('collect', tempResult[postbackData.data]);
//         if (postbackData.action === 'collect') { // collect data
//             if (tempResult.hasOwnProperty(postbackData.data)) { // check data still in system
//                 var newRestaurantObj = tempResult[postbackData.data];
//                 newRestaurantObj.UUID = postbackData.data; // ADD uuid as key of data
//                 fs.readFile(dataFile, (err, content) => {
//                     if (err) {
//                         console.log('Error loading info file: ', err);
//                         return;
//                     }
//                     var msg = {
//                         "type": "text",
//                         "text": "資料已加入收藏\n輸入+++list查看收藏明細",
//                     }
//                     var currentData = JSON.parse(content);
//                     if (currentData.hasOwnProperty(event.source.userId)) { // push restaurant data to DB
//                         if (currentData[event.source.userId].collection.length < currentData[event.source.userId].max) {
//                             currentData[event.source.userId].collection.push(newRestaurantObj);
//                         } else {
//                             msg.text = "收藏餐廳筆數超出限制，請先移除部分資料。\n輸入+++list查看收藏明細";
//                         }
//                     } else { // create new data
//                         currentData[event.source.userId] = {
//                             "collection": [newRestaurantObj],
//                             "max": maxSearchNumber
//                         };
//                     }
//                     // console.log('DB update', currentData);
//                     showDataSize(currentData);
//                     fs.writeFile(dataFile, JSON.stringify(currentData), (err) => {
//                         if (err) throw err;
//                         lineReply(event, msg);
//                         // auto backup to google driver when data has been change
//                         console.log("AUTO BACKUP");
//                         uploadFile(oauth2Client, {
//                             name: `data_${getDate()}.json`,
//                             type: 'application/json',
//                             path: dataFile,
//                             folderId: folderId,
//                         });
//                     });
//                 });
//             } else {
//                 lineReply(event, {
//                     'type': 'text',
//                     'text': '餐廳資料已過期，請重新搜尋',
//                 });
//             }
//         } else if (postbackData.action === 'delete') { // delete collection
//             fs.readFile(dataFile, (err, content) => {
//                 if (err) {
//                     console.log('Error loading info file: ', err);
//                     return;
//                 }
//                 var msg = {
//                     "type": "text",
//                     "text": "資料已移除",
//                 }
//                 var currentData = JSON.parse(content);
//                 if (currentData.hasOwnProperty(event.source.userId)) { // remove data from list
//                     var newCollection = currentData[event.source.userId].collection.filter((obj) => {
//                         return obj.UUID !== postbackData.data;
//                     });
//                     currentData[event.source.userId].collection = newCollection;
//                 }
//                 showDataSize(currentData);
//                 fs.writeFile(dataFile, JSON.stringify(currentData), (err) => {
//                     if (err) throw err;
//                     lineReply(event, msg);
//                     // auto backup to google driver when data has been change
//                     console.log("AUTO BACKUP");
//                     uploadFile(oauth2Client, {
//                         name: `data_${getDate()}.json`,
//                         type: 'application/json',
//                         path: dataFile,
//                         folderId: folderId,
//                     });
//                 });
//             });
//         }
//     }
// });
// // bot.on('leave',    function (event) { });
// // bot.on('beacon',   function (event) { });


// // start express server
// var path = require('path');
// var app = express();
// var linebotParser = bot.parser();
// app.post('/', linebotParser);
// var port = process.env.PORT || '3000';
// app.set('port', port);
// app.use(express.static(path.join(__dirname, 'public')));

// app.get('/manage', (req, res, next) => {
//     console.log('SHOW JSON');
//     var password = req.query.q;
//     var passwordArray = JSON.parse(process.env.HostUserId);
//     if (passwordArray.indexOf(password) > -1) { // check password
//         fs.readFile(dataFile, function (err, content) {
//             if (err) {
//                 console.log('Error loading client secret file: ' + err);
//                 return;
//             }
//             var data = JSON.parse(content);
//             res.send(data);
//         });
//     } else {
//         res.end();
//     }
// });
// app.get('/download', (req, res, next) => { // download json file
//     console.log('DOWNLAOD JSON');
//     var password = req.query.q;
//     var passwordArray = JSON.parse(process.env.HostUserId);
//     if (passwordArray.indexOf(password) > -1) { // check password
//         res.download(dataFile, `data_${getDate()}.json`, (error) => {
//             if (error) {
//                 console.log('ERR', error);
//             } else {
//                 res.end();
//             }
//         });
//     } else {
//         res.end();
//     }
// });

// app.listen(port, () => {
//     console.log('app is listening at port 3000');
// });