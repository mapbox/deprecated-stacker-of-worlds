'use strict';

/**
 * Recursively run all coordinates in a GeoJSON coordinates value
 * through a transformation function.
 *
 * @param {GeoJSONCoordinates} coordinates
 * @param {Function} transform - Transform function that recieves
 *   a coordinate pair and returns a transformed coordinate pair
 * @return {GeoJSONCoordinates} Transformed coordinates
 */
function transformCoordinates(coordinates, transform) {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map((subValue) => transformCoordinates(subValue.slice(), transform));
  }
  return transform(coordinates.slice());
}

module.exports = transformCoordinates;
