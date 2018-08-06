// get items in Flash Deals
const Promise = require('bluebird');
const querystring = require('querystring');
const Spider = require('./Spider');

const BASE_URL = 'https://gpsfront.aliexpress.com/getRecommendingResults.do?';
/**
 widget_id=5561374
 platform=pc
 limit=12
 offset=48
 phase=1
 productIds2Top=
 postback=54eebe30-d90a-480b-8766-a17bbd5144fe&_=1533505849258
 * @type {{get: module.exports.get}}
 */
module.exports = {
    get: function get(opt) {
        let qstr = {
            widget_id: 5561374,
            platform: 'pc',
            limit: 25,
            offset: 0,
            phase: 1
        };
        if (typeof opt === 'object') {
            Object.keys(opt).forEach(function (k) {
                qstr[k] = opt[k];
            });
        }
        const strParams = querystring.stringify(qstr);
        const spider = new Spider(BASE_URL + strParams);

        return new Promise((resolve, reject) => {
            spider.getJSON().then((content) => {
                return resolve(content);
            }, reject);
        });
    },
};