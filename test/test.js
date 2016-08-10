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

test('real world LineString', function(assert) {
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

test('multiworld Polygon', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [-999.84374999999999, 53.330872983017066],
        [56.25, -53.330872983017045],
        [831.09375, -1.4061088354351468],
        [-999.84374999999999, 53.330872983017066],
      ]],
    },
  }), {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [180, 43.24700618729348],
            [80.15625, 53.330872983017066],
            [180,50.34598380551314],
            [180,43.24700618729348],
          ],
        ],
        [
          [
            [180,6.88827520552951],
            [-180,43.24700618729348],
            [-180,50.34598380551314],
            [180,39.58356648944266],
            [180,6.88827520552951],
          ],
        ],
        [
          [
            [180,-29.47045577623445],
            [-180,6.88827520552951],
            [-180,39.58356648944266],
            [180,28.82114917337218],
            [180,-29.47045577623445],
          ],
        ],
        [
          [
            [180,-45.03798869084426],
            [56.25,-53.330872983017045],
            [-180,-29.47045577623445],
            [-180,28.82114917337218],
            [180,18.0587318573017],
            [180,-45.03798869084426],
          ],
        ],
        [
          [
            [180,-20.913234386341596],
            [-180,-45.03798869084426],
            [-180,18.0587318573017],
            [180,7.296314541231219],
            [180,-20.913234386341596],
          ],
        ],
        [
          [
            [-180,7.296314541231219],
            [111.09375,-1.4061088354351468],
            [-180,-20.913234386341596],
            [-180,7.296314541231219],
          ],
        ],
      ],
    },
  }, 'returns stacked MultiPolygon');
  assert.end();
});

test('real world Polygon drawn counterclockwise', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.90625, 57.32652122521709],
        [59.0625, 40.979898069620155],
        [80.15625, 40.979898069620155],
        [68.90625, 57.32652122521709],
      ]],
    },
  }), {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [68.90625, 57.32652122521709],
        [80.15625, 40.979898069620155],
        [59.0625, 40.979898069620155],
        [68.90625, 57.32652122521709],
      ]],
    },
  }, 'returns unchanged except redirected clockwise');
  assert.end();
});

test('otherworldly Polygon', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [819.84375, 48.922499263758255],
        [832.5, 33.137551192346145],
        [812.8125, 33.137551192346145],
        [819.84375, 48.922499263758255],
      ]],
    },
  }), {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [99.84375, 48.922499263758255],
        [112.5, 33.137551192346145],
        [92.8125, 33.137551192346145],
        [99.84375, 48.922499263758255],
      ]],
    },
  }, 'returns unchanged except redirected clockwise');
  assert.end();
});
