// get items in Flash Deals
const Promise = require('bluebird');
const qs = require('querystring');
const Spider = require('./Spider');

const BASE_URL = 'https://freight.aliexpress.com/ajaxFreightCalculateService.htm?';
/**
 // https://freight.aliexpress.com/ajaxFreightCalculateService.htm?
 // f=d
 // &productid=32858080658
 // &count=1
 // &minPrice=1.08
 // &maxPrice=1.81
 // &currencyCode=USD
 // &transactionCurrencyCode=USD
 // &sendGoodsCountry=
 // &country=LV
 // &province=
 // &city=
 // &abVersion=1
 * @type {{get: module.exports.get}}
 */
module.exports = {
    get: function get(opt) {
        let qstr = {
            minPrice: 1.0,
            maxPrice: 2.0,
            count: 1,
            country: 'US',
            currencyCode: 'USD',
            transactionCurrencyCode: 'USD',
            abVersion: 1,
            productid: 32858080658
        };
        if (typeof opt === 'object') {
            Object.keys(opt).forEach(function (k) {
                qstr[k] = opt[k];
            });
        }
        const strParams = qs.stringify(qstr);
        const spider = new Spider(BASE_URL + strParams);

        return new Promise((resolve, reject) => {
            if (!opt || !opt.productid) return reject(new Error('require productid'));
            spider.getJSON().then((content) => {
                return resolve(content);
            }, reject);
        });
    },
};