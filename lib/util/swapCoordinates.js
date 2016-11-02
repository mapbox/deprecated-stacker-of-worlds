'use strict';

/**
 * Create a new GeoJSON feature that clones an existing feature but
 * with new coordinates.
 *
 * @param {GeoJSONFeature} feature
 * @param {GeoJSONCoordinates} newCoordinates
 * @return {GeoJSONFeature}
 */
function swapCoordinates(feature, newCoordinates) {
  return Object.assign({}, feature, {
    geometry: Object.assign({}, feature.geometry, {
      coordinates: newCoordinates,
    }),
  });
}

module.exports = swapCoordinates;
