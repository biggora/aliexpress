var AliExpress = require('../');
var Spider = require('../lib/Spider');
var assert = require('assert');
var should = require('should');

var good;

describe('Spider', function () {
    var url = 'https://www.aliexpress.com/';
    it(['request', url, 'show return a web page as a HTML'].join(' '), function () {
        var spider = new Spider(url);
        return spider.getHTML(url).then(function (d) {
            d.should.be.an.String();
        });
    });
});

describe('Categories', function () {
    it('should return a list of items', function () {
        return AliExpress.Categories.get().then(function (data) {
            data.should.be.an.instanceOf(Object);
            data.optionItemList.should.be.an.instanceOf(Array);
            const category = data.optionItemList[0] || null;
            category.should.be.an.instanceOf(Object);
            category.name.should.be.an.String();
        });
    });
});

// describe('Best Selling', function () {
//     it('should return a list of items', function () {
//         return AliExpress.BestSelling.get().then(function (data) {
//             data.should.be.an.instanceOf(Array);
//             good = data[0] || null;
//             good.should.be.an.instanceOf(Object);
//             good.url.should.be.an.String();
//         });
//     });
// });

describe('Flash Deals', function () {
    it('should return a list of items', function () {
        return AliExpress.FlashDeals.get().then(function (data) {
            data.should.be.an.instanceOf(Object);
            data.products.should.be.an.instanceOf(Array);
            good = data.products[0] || null;
            good.should.be.an.instanceOf(Object);
            good.productDetailUrl.should.be.an.String();
        });
    });
});

describe('Recommendations', function () {
    it('should return a list of items', function () {
        return AliExpress.Recommendations.get().then(function (data) {
            data.should.be.an.instanceOf(Object);
            data.results.should.be.an.instanceOf(Array);
            const recGood = data.results[0] || null;
            recGood.should.be.an.instanceOf(Object);
            recGood.productDetailUrl.should.be.an.String();
        });
    });
});

describe('Detail', function () {
    it('showuld return Good Detail', function () {
        return AliExpress.Detail(good.productDetailUrl).then(function (data) {
            data.should.be.an.instanceOf(Object);
            data.productId.should.be.an.String();
            data.orderCount.should.be.an.Number();
        });
    });
});

describe('Freight Countries', function () {
    it('should return Countries list', function () {
        return AliExpress.FreightCountries.get().then(function (data) {
            data.should.be.an.instanceOf(Object);
            data.countries.should.be.an.instanceOf(Array);
            const country = data.countries[0] || null;
            country.should.be.an.instanceOf(Object);
            country.c.should.be.an.String();
        });
    });
});

// https://freight.aliexpress.com/ajaxFreightCalculateService.htm?f=d&productid=32858080658&count=1&minPrice=1.08&maxPrice=1.81&currencyCode=USD&transactionCurrencyCode=USD&sendGoodsCountry=&country=LV&province=&city=&abVersion=1