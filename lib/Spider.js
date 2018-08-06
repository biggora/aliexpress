const Promise = require('bluebird');
const Phantom = require('phantom');
const request = require('request');

module.exports = class Spider {
    constructor(url, config) {
        this.url = url;
        this.config = config || {};
        this._ph = undefined;
        this._page = undefined;
        this._outObj = undefined;

        // get HTML
        this.getHTML = () => {
            return new Promise((resolve, reject) => {
                new Promise((rslv, rjt) => {
                    if (!this._ph || !this._page) {
                        Phantom.create(['--load-images=no']).then(ph => {
                            this._ph = ph;
                            return this._ph.createPage();
                        }).then(page => {
                            this._page = page;
                            return rslv(this._page.open(this.url));
                        });
                    } else {
                        return rslv(this._page.open(this.url));
                    }
                }).then(status => {
                    return this._page.property('content');
                }).then(content => {
                    return resolve(content);
                }).catch(e => {
                    return reject(e);
                });
            });
        };

        // get JSON
        this.getJSON = (url) => {
            const lastUrl = url || this.url;
            return new Promise((resolve, reject) => {
                request.get({url: lastUrl, followAllRedirects: true }, function (e, r, body) {
                    if (!e && r.statusCode === 200) {
                        body = body.toString().replace(/^callback\(|\)$/gi,'');
                        const content = JSON.parse(body);
                        return resolve(content);
                    } else {
                        return reject(e);
                    }
                })
            });
        };

        // get variables in javascript
        this.getValue = (name) => {
            this._page.evaluate(function () {
                console.log('document', document);
                return document[name];
            });
        }
    }
};
