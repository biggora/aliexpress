// get items in Flash Deals
const Promise = require('bluebird');
const qs = require('querystring');
const Spider = require('./Spider');

const BASE_URL = 'https://lighthouse.aliexpress.com/wssearchtool/siteAllCategory.json?';
/**
 * @type {{get: module.exports.get}}
 */
module.exports = {
    get: function get(opt) {
        let qstr = {
            glo: 'glo'
        };
        if (typeof opt === 'object') {
            Object.keys(opt).forEach(function (k) {
                qstr[k] = opt[k];
            });
        }
        const strParams = qs.stringify(qstr);
        const spider = new Spider(BASE_URL + strParams);

        return new Promise((resolve, reject) => {
            spider.getJSON().then((content) => {
                return resolve(content);
            }, reject);
        });
    },
};