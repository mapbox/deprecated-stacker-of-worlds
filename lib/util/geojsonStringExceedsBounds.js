'use strict';

/**
 * Returns a boolean indicating whether a string contains a number +/-180
 *
 * @param {string} input
 * @return {boolean}
 */
function geojsonStringExceedsBounds(input) {
  // TODO: Scientific notation?
  return /\b-?(?:[2-9]\d\d\D|19\d\D|18[^0]\D|180\.0*[^0\D])/g.test(input);
}

module.exports = geojsonStringExceedsBounds;
