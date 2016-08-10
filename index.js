'use strict';

const turf = require('turf');

const realWorldOutline = [
  [-180, 90],
  [180, 90],
  [180, -90],
  [-180, -90],
  [-180, 90],
];

const worldCache = {};
function createWorld(worldNumber) {
  if (worldCache[worldNumber]) return worldCache[worldNumber];

  const worldOutline = realWorldOutline.map(function(lngLat) {
    return [lngLat[0] + 360 * worldNumber, lngLat[1]];
  });

  const world = {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [worldOutline],
    },
  };

  worldCache[worldNumber] = world;
  return world;
}

function stackMultiWorldFeature(feature) {
  const bbox = turf.bbox(feature);
  const rangeOfWorlds = [Math.floor(bbox[0] / 360), Math.ceil(bbox[2] / 360)];

  const stackedCoordinates = [];
  for (let worldNumber = rangeOfWorlds[0]; worldNumber <= rangeOfWorlds[1]; worldNumber++) {
    const world = createWorld(worldNumber);
    const intersection = turf.intersect(feature, world);
    if (!intersection) continue;

    const lngOffset = worldNumber * -360;
    const oneWorldCoordinates = transformCoordinates(intersection.geometry.coordinates, function(lngLat) {
      return [lngLat[0] + lngOffset, lngLat[1]];
    });
    stackedCoordinates.push(oneWorldCoordinates);
  }

  if (stackedCoordinates.length === 1) {
    return Object.assign({}, feature, {
      geometry: Object.assign({}, feature.geometry, {
        coordinates: stackedCoordinates[0],
      }),
    });
  }

  return {
    type: 'Feature',
    properties: feature.properties,
    geometry: {
      type: `Multi${feature.geometry.type}`,
      coordinates: stackedCoordinates,
    },
  };
}

function transformCoordinates(coordinates, transform) {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(subValue => transformCoordinates(subValue.slice(), transform));
  }
  return transform(coordinates.slice());
}

module.exports = stackMultiWorldFeature;
