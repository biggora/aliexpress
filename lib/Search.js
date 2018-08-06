const Promise = require('bluebird');
const cheerio = require('cheerio');
const qs = require('querystring');
const Spider = require('./Spider');

const Image = require('./common/image');
const Strings = require('./common/strings');
const Product = require('./common/product');
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
                products: [],
                lastPage: false,
                finished: false,
                pages: 0,
                page: opt.page || 1,
                pageSize: 0,
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
                tmp.productTitle = titleElm.attr('title');
                tmp.vendor = titleElm.text().split(/\s/)[0];
                tmp.productDetailUrl = $(ele).find('h3 a').attr('href');
                tmp.productId = Strings.getIdFromUrl(tmp.productDetailUrl);
                tmp.catId = $(ele).attr('pub-catid');

                tmp.minPrice = $(ele).find('.price .value').text();
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
                tmp.productImage = img.src || img['image-src'];

                if (tmp.productImage) {
                    tmp.productImage = Image.getOriginalUrl(tmp.productImage);
                }
                if (tmp.productDetailUrl) {
                    tmp.productDetailUrl = Strings.getDetailUrl(tmp.productDetailUrl);
                }
                if (tmp.variants === '') {
                    tmp.variants = 1;
                }
                tmp.store = {
                    name: $(ele).find('.store').attr('title'),
                    url: $(ele).find('.store').attr('href')
                };
                tmp.store.id = Strings.getIdFromUrl(tmp.store.url);
                result.products.push(new Product(tmp));
            });
            result.pages = $('.ui-pagination-navi a').length;
            result.pageSize = result.products.length;
            result.lastPage = result.page === result.pages;
            return resolve(result);
        })
    })
};