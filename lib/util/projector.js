'use strict';

// Copied from node-sphericalmercator and liberated from the bondage of
// real-world longitudes.
//
// https://github.com/mapbox/node-sphericalmercator/blob/master/sphericalmercator.js

const D2R = Math.PI / 180;
const R2D = 180 / Math.PI;
// 900913 properties.
const A = 6378137.0;
const MAXEXTENT = 20037508.342789244;

function lngLat2xy(lngLat) {
  const xy = [
    A * lngLat[0] * D2R,
    A * Math.log(Math.tan((Math.PI * 0.25) + (0.5 * lngLat[1] * D2R))),
  ];
  if (xy[1] > MAXEXTENT) xy[1] = MAXEXTENT;
  if (xy[1] < -MAXEXTENT) xy[1] = -MAXEXTENT;
  return xy;
}

function xy2LngLat(xy) {
  return [
    (xy[0] * R2D / A),
    ((Math.PI * 0.5) - 2.0 * Math.atan(Math.exp(-xy[1] / A))) * R2D,
  ];
}

module.exports = {
  lngLat2xy,
  xy2LngLat,
};
