'use strict';

const test = require('tap').test;
const stackerOfWorlds = require('..');

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
  }), [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [181, 43.146009712344124],
            [80.15625, 53.330872983017066],
            [181, 50.3160882018574],
            [181, 43.146009712344124],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [181, 6.787278730580167],
            [-179, 43.146009712344124],
            [-179, 50.3160882018574],
            [181, 39.55367088578691],
            [181, 6.787278730580167],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [181, -29.571452251183793],
            [-179, 6.787278730580167],
            [-179, 39.55367088578691],
            [181, 28.79125356971643],
            [181, -29.571452251183793],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [181, -44.97097548444286],
            [56.25, -53.330872983017045],
            [-179, -29.571452251183793],
            [-179, 28.79125356971643],
            [181, 18.02883625364595],
            [181, -44.97097548444286],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [181, -20.846221179940198],
            [-179, -44.97097548444286],
            [-179, 18.02883625364595],
            [181, 7.266418937575466],
            [181, -20.846221179940198],
          ],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [-179, 7.266418937575466],
            [111.09375, -1.4061088354351468],
            [-179, -20.846221179940198],
            [-179, 7.266418937575466],
          ],
        ],
      },
    },
  ], 'returns stacked MultiPolygon');
  assert.end();
});

test('real-world Polygon drawn counterclockwise', function(assert) {
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
  }), [
      {
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
    },
  ], 'returns unchanged except redirected clockwise');
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
  }), [
      {
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
    },
  ], 'returns unchanged except redirected clockwise');
  assert.end();
});

test('MultiPolygon', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [-113.90625, 54.97761367069628],
            [-127.96875, 28.92163128242129],
            [-92.10937499999999, 28.92163128242129],
            [-113.90625, 54.97761367069628],
          ],
        ],
        [
          [
            [291.09375, -22.593726063929296],
            [296.015625, -53.330872983017045],
            [320.625, -9.10209673872643],
            [291.09375, -22.593726063929296],
          ],
        ],
        [
          [
            [-340.3125, -27.68352808378776],
            [2.8125, 5.61598581915534],
            [251.015625, 46.07323062540838],
            [-340.3125, -27.68352808378776],
          ],
        ],
      ],
    },
  }), [{
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'Polygon',
      coordinates: [[
        [181, -12.028510709744749],
        [19.6875, -27.68352808378776],
        [181, -7.56291038227525],
        [181, -12.028510709744749],
      ]],
    },
  }, {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[
          [-113.90625, 54.97761367069628],
          [-92.10937499999999, 28.92163128242129],
          [-127.96875, 28.92163128242129],
          [-113.90625, 54.97761367069628],
        ]],
        [[
          [181, 34.66064554660323],
          [2.8125, 5.61598581915534],
          [-179, -12.028510709744749],
          [-179, -7.56291038227525],
          [181, 37.34013415887626],
          [181, 34.66064554660323],
        ]],
      ],
    },
  }, {
    type: 'Feature',
    properties: {},
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [[
          [-68.90625, -22.593726063929296],
          [-39.375, -9.10209673872643],
          [-63.984375, -53.330872983017045],
          [-68.90625, -22.593726063929296],
        ]],
        [[
          [-179, 37.34013415887626],
          [-108.984375, 46.07323062540838],
          [-179, 34.66064554660323],
          [-179, 37.34013415887626],
        ]],
      ],
    },
  }]);
  assert.end();
});