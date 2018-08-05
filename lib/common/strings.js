module.exports = {
    getIdFromUrl: function (url) {
        if ('string' !== typeof url) return '';
        return url.split('?').shift().split('/').pop().split('.').shift();
    },
    getNumberFromString: function (str) {
        if ('string' !== typeof str) return '';
        return str.replace(/[^0-9.]/g, '');
    },
    getDetailUrl: function (url) {
        if ('string' !== typeof url) return '';
        let cutUrl = url.split('?')[0];
        if (!/^http/.test(cutUrl)) {
            cutUrl += 'https:' + cutUrl;
        }
        return cutUrl;
    },
};
