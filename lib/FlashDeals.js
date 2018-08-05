// get items in Best Selling
const Promise = require('bluebird');
const cheerio = require('cheerio');
const Spider = require('./Spider');

const BASE_URL = 'https://gpsfront.aliexpress.com/queryGpsProductAjax.do?';
/**
 * https://gpsfront.aliexpress.com/queryGpsProductAjax.do?callback=jQuery183041997068221737766_1533505819429
 &widget_id=5547572
 &platform=pc
 &limit=12
 &offset=48
 &phase=1
 &productIds2Top=
 &postback=54eebe30-d90a-480b-8766-a17bbd5144fe&_=1533505849258
 * @type {{get: module.exports.get}}
 */
module.exports = {
  get: function get (){
    const spider = new Spider(BASE_URL);
    return new Promise((resolve, reject) => {
        spider.getJSON(url).then((content) => {
            return resolve(content);
        }, reject);
    });
  },
};