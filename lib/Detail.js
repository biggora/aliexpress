const Promise = require('bluebird');
const cheerio = require('cheerio');
const Spider = require('./Spider');
const Image = require('./common/image');
const Strings = require('./common/strings');

module.exports = function (url){
    const spider = new Spider(url);
    return new Promise((resolve, reject) => {
        spider.getHTML(url).then((content) => {
            const detail = {
                productId: '',
                productDetailUrl: url,
                productTitle: '',
                options: {}
            };
            const $ = cheerio.load(content);
            // get productId from page javascript variables
            detail.productId = spider.getValue('productId');
            // get productId from url
            if (!detail.productId) {
                try {
                    detail.productId = url.split('?').shift().split('/').pop().split('.').shift();
                } catch (e) {
                    detail.productId = undefined;
                }
            }
            // get name
            $('.detail-wrap h1.product-name').each((key, ele) => {
                if (!ele || !ele.children || !ele.children[0] || !ele.children[0].data) return;
                detail.productTitle = ele.children[0].data;
            });
            // get picture
            detail.gallery = [];
            $('ul.image-thumb-list li span.img-thumb-item img').each((key, ele) => {
                if (!ele || !ele.attribs || !ele.attribs.src) return;
                detail.gallery.push({
                    alt: ele.attribs.alt || '',
                    // src: ele.attribs.src.replace('_50x50.jpg', '') || ''
                    src: Image.getOriginalUrl(ele.attribs.src)
                });
            });
            //get property
            detail.params = [];
            // get property title
            $("ul.product-property-list li.property-item .propery-title").each((key, ele) => {
                if (!detail.params[key]) detail.params[key] = {};
                if (!ele || !ele.children || !ele.children[0] || !ele.children[0].data) {
                    detail.params[key].title = "";
                } else {
                    detail.params[key].title = ele.children[0].data;
                }
            });
            // get property description
            $("ul.product-property-list li.property-item .propery-des").each((key, ele) => {
                if (!detail.params[key]) detail.params[key] = {};
                if (!ele || !ele.children || !ele.children[0] || !ele.children[0].data) {
                    detail.params[key].desc = "";
                } else {
                    detail.params[key].desc = ele.children[0].data;
                }
            });

            $("dl.p-property-item").each((key, ele) => {
                const p_title = $(ele).find('.p-item-title').text().replace(':','');
                const p_main = $(ele).find('.p-item-main li a');
                console.log(p_title, p_main)
                detail.options[p_title] = [];
                p_main.each((key2, ele2) => {
                    const img2 = $(ele2).find('img');
                    detail.options[p_title].push({
                        id: $(ele2).attr('id'),
                        sku: $(ele2).attr('data-sku-id'),
                        title: (img2 && img2.attr('title')) || $(ele2).text(),
                        image: (img2 && img2.attr('src')) || null,
                        bigpic: (img2 && img2.attr('bigpic')) || null
                    });
                });
            });

            // get order count
            let orderCount = parseInt($('#j-order-num').text().replace(' orders', ''), 10);
            if (isNaN(orderCount)) {
                detail.orderCount = 0;
            } else {
                detail.orderCount = orderCount;
            }
            detail.stock = parseInt(Strings.getNumberFromString($('#j-sell-stock-num').text()), 10);
            detail.totalStock = detail.orderCount + detail.stock;

            // get feedback detail
            detail.feedback = {};
            detail.feedback.count = parseInt($("#j-product-tabbed-pane li[data-trigger='feedback'] a").text().replace("Feedback (", ""), 10);
            detail.feedback.stars = {};
            $("#j-product-rate-balloon ul li").each((index, ele) => {
                detail.feedback.stars[5 - index] = parseInt($(ele).find('.r-num').text(), 10);
            });
            detail.feedback.voteCount = parseInt($('#j-customer-reviews-trigger .rantings-num').text().replace('(', ''), 10);
            detail.feedback.rating = parseFloat($('#j-customer-reviews-trigger .percent-num').text());
            return resolve(detail);
        }, reject);
    });
};