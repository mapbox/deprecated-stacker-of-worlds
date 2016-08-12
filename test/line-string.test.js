'use strict';

const test = require('tap').test;
const stackerOfWorlds = require('..');

test('multiworld LineString', function(assert) {
  const input = {
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
  };

  const actual = stackerOfWorlds(input);

  console.log(JSON.stringify(input, null, 2));
  console.log(JSON.stringify(actual, null, 2));

  assert.deepEqual(actual, [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-69.60937499999999, -53.330872983017045],
          [150.46875, -27.68352808378776],
          [181, -21.424646837004616],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-181, -21.834645199127564],
          [43.59375, 24.206889622398023],
          [181, 39.555724400529044],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-181, 39.33231629823194],
          [-71.015625, 51.6180165487737],
          [181, 64.16749401151199],
        ],
      },
    },
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-181, 64.06790115918199],
          [-149.0625, 65.6582745198266],
        ],
      },
    },
  ], 'returns one feature per world');
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
  }), [
    {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'LineString',
        coordinates: [
          [-14.0625, 13.923403897723347],
          [33.75, 15.284185114076445],
        ],
      },
    },
  ], 'returns unchanged');
  assert.end();
});

// test('otherworldly LineString', function(assert) {
//   assert.deepEqual(stackerOfWorlds({
//     type: 'Feature',
//     properties: { id: 'ccc' },
//     geometry: {
//       type: 'LineString',
//       coordinates: [
//         [348.75, 43.068887774169625],
//         [405, 43.068887774169625],
//       ],
//     },
//   }), [
//     {
//       type: 'Feature',
//       properties: {},
//       geometry: {
//         type: 'LineString',
//         coordinates: [
//           [-11.25, 43.068887774169625],
//           [45, 43.068887774169625],
//         ],
//       },
//     },
//   ], 'shifted to world one');
//   assert.end();
// });
//
// test('MultiLineString', function(assert) {
//   assert.deepEqual(stackerOfWorlds({
//     type: 'Feature',
//     properties: { id: 'foo' },
//     geometry: {
//       type: 'MultiLineString',
//       coordinates: [
//         [[0, 0], [100, 10]],
//         [[-390, 30], [-420, 40]],
//         [[-200, -40], [400, 42]],
//       ],
//     },
//   }), [
//     {
//       type: 'Feature',
//       properties: {},
//       geometry: {
//         type: 'MultiLineString',
//         coordinates: [
//           [
//             [-30, 30],
//             [-60, 40],
//           ],
//           [
//             [160, -40],
//             [181, -37.13],
//           ],
//         ],
//       },
//     }, {
//       type: 'Feature',
//       properties: {},
//       geometry: {
//         type: 'MultiLineString',
//         coordinates: [
//           [
//             [0, 0],
//             [100, 10],
//           ],
//           [
//             [-181, -37.403333333333336],
//             [181, 12.07],
//           ],
//         ],
//       },
//     }, {
//       type: 'Feature',
//       properties: {},
//       geometry: {
//         type: 'LineString',
//         coordinates: [
//           [-181, 11.796666666666667],
//           [40, 42],
//         ],
//       },
//     },
//   ], 'returns one feature per world');
//   assert.end();
// });
