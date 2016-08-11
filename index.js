'use strict';

const turf = require('turf');

const realWorldOutline = [
  [-181, 90],
  [181, 90],
  [181, -90],
  [-181, -90],
  [-181, 90],
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
  if (feature.type === 'FeatureCollection') {
    return Object.assign({}, feature, {
      features: feature.features.reduce(function(result, subFeature) {
        return result.concat(stackMultiWorldFeature(subFeature));
      }, []),
    });
  }

  const bbox = turf.bbox(feature);
  const rangeOfWorlds = [Math.floor(bbox[0] / 360), Math.ceil(bbox[2] / 360)];

  const stackedFeatures = [];
  for (let worldNumber = rangeOfWorlds[0]; worldNumber <= rangeOfWorlds[1]; worldNumber++) {
    const world = createWorld(worldNumber);
    const intersection = turf.intersect(feature, world);
    if (!intersection) continue;

    const lngOffset = worldNumber * -360;
    const oneWorldCoordinates = transformCoordinates(intersection.geometry.coordinates, function(lngLat) {
      return [lngLat[0] + lngOffset, lngLat[1]];
    });
    const newFeature = Object.assign({}, intersection, {
      properties: feature.properties,
      geometry: Object.assign({}, intersection.geometry, {
        coordinates: oneWorldCoordinates,
      }),
    });
    delete newFeature.properties.id;

    stackedFeatures.push(newFeature);
  }

  return stackedFeatures;
}

function transformCoordinates(coordinates, transform) {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map(subValue => transformCoordinates(subValue.slice(), transform));
  }
  return transform(coordinates.slice());
}

module.exports = stackMultiWorldFeature;
