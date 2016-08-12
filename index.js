'use strict';

const turf = require('turf');
const superSphere = require('./lib/super-sphere');

// The extra degree of longitude is to produce some overlap, so there is
// not a strict cut-off line at the antimeridian
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

  const worldOutline = realWorldOutline
    .map(function(lngLat) {
      return superSphere.lngLat2xy([lngLat[0] + 360 * worldNumber, lngLat[1]]);
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
  const unprojectedFeature = transformFeatureCoordinates(feature, superSphere.lngLat2xy);

  const stackedFeatures = [];
  for (let worldNumber = rangeOfWorlds[0]; worldNumber <= rangeOfWorlds[1]; worldNumber++) {
    const world = createWorld(worldNumber);
    const intersection = turf.intersect(unprojectedFeature, world);
    if (!intersection) continue;

    const lngOffset = worldNumber * -360;
    const newFeature = transformFeatureCoordinates(intersection, function(lngLat) {
      const projectedLngLat = superSphere.xy2LngLat(lngLat);
      return [projectedLngLat[0] + lngOffset, projectedLngLat[1]];
    });
    newFeature.properties = feature.properties;

    // id will not be unique anymore if the feature is split
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

function transformFeatureCoordinates(feature, transform) {
  return Object.assign({}, feature, {
    geometry: Object.assign({}, feature.geometry, {
      coordinates: transformCoordinates(feature.geometry.coordinates, transform),
    }),
  });
}

module.exports = stackMultiWorldFeature;
