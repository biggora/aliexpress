const Promise = require('bluebird');
const cheerio = require('cheerio');
const qs = require('querystring');
const Spider = require('./Spider');

const Image = require('./common/image');
const Strings = require('./common/strings');
/**
 url sample: https://www.aliexpress.com/wholesale?catId=0&initiative_id=SB_20170201171227&SearchText=ipad
 referer:https://www.aliexpress.com/
 */
module.exports = function (opt) {
    return new Promise((resolve, reject) => {
        let qstr = {};
        let keyword = '';
        if (typeof opt === 'string') {
            keyword = opt
        } else {
            keyword = opt.keyword
        }
        if (!keyword) return reject(new Error('require keyword'));
        qstr.SearchText = encodeURIComponent(keyword);
        if (typeof opt === 'object') {
            Object.keys(opt).forEach(function(k){
                if (k !== 'keyword') {
                    qstr[k] = opt[k];
                }
            });
        }
        const strParams = qs.stringify(qstr);
        let url = 'https://www.aliexpress.com/wholesale?' + strParams;
        let spider = new Spider(url);
        spider.getHTML().then(content => {
            let result = {
                url: url,
                list: [],
                pages: 0
            };

            let $ = cheerio.load(content, {
                normalizeWhitespace: true,
                xmlMode: true
            });
            const items = $('li.list-item');
            let total = items.length;
            // get search result
            items.each((key, ele) => {
                let tmp = {};
                const titleElm = $(ele).find('h3 a');
                tmp.name = titleElm.attr('title');
                tmp.vendor = titleElm.text().split(/\s/)[0];
                tmp.url = $(ele).find('h3 a').attr('href');
                tmp.productId = Strings.getIdFromUrl(tmp.url);
                tmp.catid = $(ele).attr('pub-catid');

                tmp.price = $(ele).find('.price .value').text();
                tmp.unit = $(ele).find('span.unit').text().toLowerCase();
                tmp.orderCount = Strings.getNumberFromString($(ele).find('.order-num em').text());
                tmp.feedback = {
                    count: Strings.getNumberFromString($(ele).find('.rate-history .rate-num').text()),
                    rating: Strings.getNumberFromString($(ele).find('.star.star-s').attr('title')),
                    stars: {}
                };
                tmp.feedback.voteCount = tmp.feedback.count;
                tmp.variants = Strings.getNumberFromString($(ele).find('.has-sku-image').text());

                let img = $(ele).find('img.picCore');
                img = img && img[0] && img[0].attribs;
                tmp.img = img.src || img['image-src'];

                if (tmp.img) {
                    tmp.img = Image.getOriginalUrl(tmp.img);
                }
                if (tmp.url) {
                    tmp.url = Strings.getDetailUrl(tmp.url);
                }
                if (tmp.variants === '') {
                    tmp.variants = 1;
                }
                tmp.store = {
                    // name: $(ele).find('.address-chat .address a.store').text(),
                    name: $(ele).find('.store').attr('title'),
                    url: $(ele).find('.store').attr('href')
                };
                result.list.push(tmp);
            });
            result.pages = $('.ui-pagination-navi a').length;
            return resolve(result)
        })
    })
};