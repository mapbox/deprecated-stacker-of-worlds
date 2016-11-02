'use strict';

const projector = require('./projector');

const realWorldOutline = [
  [-180, 90],
  [180, 90],
  [180, -90],
  [-180, -90],
  [-180, 90],
];

const worldCache = new Map();

/**
 * Create a projected world outline as a GeoJSON Polygon.
 *
 * @param {number} worldNumber - Positive numbers represent higher longitudes
 * @return {GeoJSONFeature} The projected world
 */
function createProjectedWorld(worldNumber) {
  if (worldCache.has(worldNumber)) return worldCache.get(worldNumber);

  const worldOutline = realWorldOutline.map((lngLat) => {
    return projector.lngLat2xy([lngLat[0] + 360 * worldNumber, lngLat[1]]);
  });

  const world = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [worldOutline],
    },
  };

  worldCache.set(worldNumber, world);
  return world;
}

module.exports = createProjectedWorld;
