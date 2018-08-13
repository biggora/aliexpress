/**
 * Created by Alex on 8/12/2018.
 */
const uuidv4 = require('uuid/v4');

module.exports = {
    CatId: 0,
    SortType: 'total_tranpro_desc',
    shipCountry: 'US',
    country: 'US',
    currencyCode: 'USD',
    transactionCurrencyCode: 'USD',
    isFavorite: 'n',
    isViewCP: 'y',
    origin: 'y',
    site: 'glo',
    platform: 'pc',
    limit: 25,
    phase: 1,
    postback: uuidv4()
};