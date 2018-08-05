// get items in Best Selling
const Promise = require('bluebird');
const cheerio = require('cheerio');
const Spider = require('./Spider');

const BASE_URL = 'https://bestselling.aliexpress.com/en?spm=2114.11010108.21.4.dkHNPl';

module.exports = {
  get: function get (){
    const spider = new Spider(BASE_URL);
    return new Promise((resolve, reject) => {
      spider.getHTML().then((content) => {
        const $ = cheerio.load(content);
        const goods = [];
        // get url and names
        $('#bestselling-top10 .item-desc').each((key, lk) => {
          if (!lk || !lk.attribs || !lk.attribs.href) return;
          if (!goods[key]) goods[key] = {};
          goods[key].url = lk.attribs.href;
          if (lk.children && lk.children[0] && lk.children[0].data) {
            goods[key].name = lk.children[0].data;
          }
        });
        // get price
        $('#bestselling-top10 .item-price .price').map((key, lk) => {
          if (!lk) return;
          if (lk.children && lk.children[0] && lk.children[0].data) {
            goods[key].price = lk.children[0].data;
          }
        });

        return resolve(goods);
      }, reject);
    });
  },
};
