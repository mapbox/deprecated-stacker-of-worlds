'use strict';

const test = require('tap').test;
const stackerOfWorlds = require('..');

test('multiworld LineString', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: { id: 'aaa' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-69.60937499999999, -53.330872983017045],
        [150.46875, -27.68352808378776],
        [403.59375, 24.206889622398023],
        [648.984375, 51.6180165487737],
        [930.9375, 65.6582745198266],
      ],
    },
  }), {
    type: 'Feature',
    properties: { id: 'aaa' },
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [
          [-69.60937499999999, -53.330872983017045],
          [150.46875, -27.68352808378776],
          [180, -21.629646018066083],
        ],
        [
          [-180, -21.629646018066083],
          [43.59375, 24.206889622398023],
          [180, 39.444020349380494],
        ],
        [
          [-180, 39.444020349380494],
          [-71.015625, 51.6180165487737],
          [180, 64.11769758534699],
        ],
        [
          [-180, 64.11769758534699],
          [-149.0625, 65.6582745198266],
        ],
      ],
    },
  }, 'returns stacked MultiLineString');
  assert.end();
});

test('real-world LineString', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: { id: 'bbb' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-14.0625, 13.923403897723347],
        [33.75, 15.284185114076445],
      ],
    },
  }), {
    type: 'Feature',
    properties: { id: 'bbb' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-14.0625, 13.923403897723347],
        [33.75, 15.284185114076445],
      ],
    },
  }, 'returns unchanged');
  assert.end();
});

test('otherworldly LineString', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: { id: 'ccc' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [348.75, 43.068887774169625],
        [405, 43.068887774169625],
      ],
    },
  }), {
    type: 'Feature',
    properties: { id: 'ccc' },
    geometry: {
      type: 'LineString',
      coordinates: [
        [-11.25, 43.068887774169625],
        [45, 43.068887774169625],
      ],
    },
  }, 'shifted to world one');
  assert.end();
});

test('MultiLineString', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: { id: 'foo' },
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [[0, 0], [100, 10]],
        [[-390, 30], [-420, 40]],
        [[-200, -40], [400, 42]],
      ],
    },
  }), {
    type: 'Feature',
    properties: { id: 'foo' },
    geometry: {
      type: 'MultiLineString',
      coordinates: [
        [[-30, 30], [-60, 40]],
        [[160, -40], [180, -37.266666666666666]],
        [[0, 0], [100, 10]],
        [[-180, -37.266666666666666], [180, 11.933333333333334]],
        [[-180, 11.933333333333334], [40, 42]],
      ],
    },
  });
  assert.end();
});
