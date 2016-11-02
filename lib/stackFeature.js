'use strict';

const intersect = require('@turf/intersect');
const bbox = require('@turf/bbox');
const turfMeta = require('@turf/meta');
const projector = require('./util/projector');
const swapCoordinates = require('./util/swapCoordinates');
const transformCoordinates = require('./util/transformCoordinates');
const createProjectedWorld = require('./util/createProjectedWorld');

/**
 * Given a GeoJSON Feature,
 * - If it is contained in real-world longitudes, return it
 * - If it exceeds real-world longitudes, return a new MultiFeature representing
 *   the same data split on datelines
 *
 * @param {GeoJSONFeature} featureString
 * @return {GeoJSONFeature} Real-world feature
 */
function stackFeature(feature) {
  let featureExceedsBounds = false;
  turfMeta.coordEach(feature, (coords) => {
    if (coords[0] > 180 || coords[0] < -180) {
      featureExceedsBounds = true;
    }
  });
  if (!featureExceedsBounds) return feature;

  if (feature.type === 'FeatureCollection') {
    return Object.assign({}, feature, {
      features: feature.features.map(stackFeature),
    });
  }

  const featureBbox = bbox(feature);
  const rangeOfWorlds = [Math.floor(featureBbox[0] / 360), Math.ceil(featureBbox[2] / 360)];
  const projectedFeatureCoordinates = transformCoordinates(feature.geometry.coordinates, projector.lngLat2xy);
  const projectedFeature = swapCoordinates(feature, projectedFeatureCoordinates);

  const stackedCoordinates = [];
  for (let worldNumber = rangeOfWorlds[0]; worldNumber <= rangeOfWorlds[1]; worldNumber++) {
    const projectedWorld = createProjectedWorld(worldNumber);
    const intersection = intersect(projectedFeature, projectedWorld);
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

  const realWorldFeature = Object.assign({}, feature, {
    geometry: {
      type: multiType,
      coordinates: stackedCoordinates,
    },
  });

  return realWorldFeature;
}

module.exports = stackFeature;
