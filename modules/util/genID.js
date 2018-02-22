// kiwi/relva/modules/util/genID.js - Created February 17th, 2018

/**
 * Returns a randomly generated string of length n beginning with `k`
 * that will not contain any other `k`
 * @param {number} n the length of the generated id
 * @param {Object} params generation parameters
 * @param {boolean} params.prefix whether or not to prefix the id with `k`
 */
module.exports = function(n, params = { prefix: true }) {
    let id = params.prefix ? 'k' : '';
    let length = params.prefix ? n : n + 1;
    let dict = "abcdefghijlmnopqrstuvwxyz0123456789";
    for (let i = 0; i < (length - 1); i++) {
        id += dict.charAt(Math.floor(Math.random() * dict.length));
    }
    return id;
};