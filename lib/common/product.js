/**
 * Created by Alex on 8/6/2018.
 */
var deepAssign = require('deep-assign');
const Image = require('./image');
const Strings = require('./strings');

const toInt = (str) => {
    if (typeof str === 'string') return parseInt(str);
    else if (Number(str) >= 0) return str;
    return;
};

const toFloat = (str) => {
    if (typeof str === 'string') return parseFloat(str);
    return;
};


class Product {
    constructor(opt) {

        this.promotionId = opt.promotionId || 0;
        this.catId = opt.catId || 0;

        this.startTime = toInt(opt.startTime) || 0;
        this.endTime = toInt(opt.endTime) || 0;

        this.discount = toInt(opt.discount) || 0;
        this.phase = toInt(opt.phase) || 1;

        this.minPrice = toFloat(Strings.getNumberFromString(opt.minPrice || '0.0'));
        this.maxPrice = toFloat(Strings.getNumberFromString(opt.maxPrice || '0.0'));
        this.oriMinPrice = toFloat(Strings.getNumberFromString(opt.oriMinPrice || '0.0'));
        this.oriMaxPrice = toFloat(Strings.getNumberFromString(opt.oriMaxPrice || '0.0'));
        this.currency = 'USD';
        this.unit = opt.unit || '';

        this.totalStock = toInt(opt.totalStock) || 0;
        this.stock = toInt(opt.stock) || 0;

        this.soldout = opt.soldout || false;
        this.orderCount = toInt(opt.orders) || toInt(opt.orderCount) || 0;

        this.productId = opt.productId || 0;
        this.productTitle = opt.productTitle || "";
        this.productImage = Strings.getDetailUrl(
            Image.getOriginalUrl(opt.productImage || "")
        );
        this.productDetailUrl = Strings.getDetailUrl(opt.productDetailUrl || "");

        this.benefit = opt.benefit || 0;
        this.offers = opt.offers || 0;
        this.variants = opt.variants || 1;

        if(!this.orderCount && /already purchased/gi.test(this.benefit)) {
            this.orderCount = toInt(Strings.getNumberFromString(this.benefit));
        }

        this.feedback = opt.feedback || {
                count: 0,
                rating: 0,
                voteCount: 0,
                stars: {}
            };

        this.store = opt.store || {
                id: opt.sellerId || 0,
                name: opt.shopName || '',
                url: Strings.getDetailUrl(opt.shopUrl || '')
            };
        this.gallery = opt.gallery || [];
        this.params = opt.params || [];
        this.options = opt.options || {};

        this.extend = (data) => {
            deepAssign(this, data);
        }
    }
}

module.exports = Product;