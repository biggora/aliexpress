// get items in Flash Deals
const Promise = require('bluebird');
const qs = require('querystring');
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
        const spider = new Spider(BASE_URL);
        const fullConfig = spider.getConfig();
        let qstr = {
            widget_id: 5561374,
            platform: fullConfig.platform,
            phase: fullConfig.phase,
            limit: fullConfig.limit,
            offset: 0
        };
        if (typeof opt === 'object') {
            Object.keys(opt).forEach(function (k) {
                qstr[k] = opt[k];
            });
        }
        const strParams = qs.stringify(qstr);
        spider.setUrl(BASE_URL + strParams);

        return new Promise((resolve, reject) => {
            spider.getJSON().then((content) => {
                return resolve(content);
            }, reject);
        });
    },
};