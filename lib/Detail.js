const Promise = require('bluebird');
const Spider = require('./Spider');

module.exports = function (url){
    const spider = new Spider(url);
    return new Promise((resolve, reject) => {
        spider.getJSON(url).then((content) => {
            const detail = {
                url: url
            };
            return resolve(content);
        }, reject);
    });
};