'use strict';

const turf = require('turf');
const projector = require('./projector');

const realWorldOutline = [
  [-180, 90],
  [180, 90],
  [180, -90],
  [-180, -90],
  [-180, 90],
];

const worldCache = {};
function createProjectedWorld(worldNumber) {
  if (worldCache[worldNumber]) return worldCache[worldNumber];

  const worldOutline = realWorldOutline
    .map((lngLat) => {
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

  worldCache[worldNumber] = world;
  return world;
}

function transformCoordinates(coordinates, transform) {
  if (Array.isArray(coordinates[0])) {
    return coordinates.map((subValue) => transformCoordinates(subValue.slice(), transform));
  }
  return transform(coordinates.slice());
}

function swapCoordinates(feature, newCoordinates) {
  return Object.assign({}, feature, {
    geometry: Object.assign({}, feature.geometry, {
      coordinates: newCoordinates,
    }),
  });
}

function stack(feature) {
  if (feature.type === 'FeatureCollection') {
    return Object.assign({}, feature, {
      features: feature.features.map(stack),
    });
  }

  const bbox = turf.bbox(feature);
  const rangeOfWorlds = [Math.floor(bbox[0] / 360), Math.ceil(bbox[2] / 360)];
  const projectedFeatureCoordinates = transformCoordinates(feature.geometry.coordinates, projector.lngLat2xy);
  const projectedFeature = swapCoordinates(feature, projectedFeatureCoordinates);

  const stackedCoordinates = [];
  for (let worldNumber = rangeOfWorlds[0]; worldNumber <= rangeOfWorlds[1]; worldNumber++) {
    const projectedWorld = createProjectedWorld(worldNumber);
    const intersection = turf.intersect(projectedFeature, projectedWorld);
    if (!intersection) continue;

    const lngOffset = worldNumber * -360;
    const unprojectedIntersectionCoordinates = transformCoordinates(intersection.geometry.coordinates, (lngLat) => {
      const projectedLngLat = projector.xy2LngLat(lngLat);
      return [projectedLngLat[0] + lngOffset, projectedLngLat[1]];
    });

    if (intersection.geometry.type.indexOf('Multi') === 0) {
      unprojectedIntersectionCoordinates.forEach((coordinates) => {
        stackedCoordinates.push(coordinates);
      });
    } else {
      stackedCoordinates.push(unprojectedIntersectionCoordinates);
    }
  }

  if (stackedCoordinates.length === 1) {
    return swapCoordinates(feature, stackedCoordinates[0]);
  }

  const multiType = (feature.geometry.type.indexOf('Multi') === 0)
    ? feature.geometry.type
    : `Multi${feature.geometry.type}`;

  return Object.assign({}, feature, {
    geometry: {
      type: multiType,
      coordinates: stackedCoordinates,
    },
  });
}

module.exports = stack;
