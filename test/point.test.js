'use strict';

const test = require('tap').test;
const stackerOfWorlds = require('..');

test('real-world Point', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {
      id: 'fire',
      type: 'extinguisher',
    },
    geometry: {
      type: 'Point',
      coordinates: [10, 40],
    },
  }), [
    {
      type: 'Feature',
      properties: {
        type: 'extinguisher',
      },
      geometry: {
        type: 'Point',
        coordinates: [10, 40],
      },
    },
  ], 'returns unchanged');
  assert.end();
});

test('otherworldly Point', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {
      id: 'fire',
      type: 'extinguisher',
    },
    geometry: {
      type: 'Point',
      coordinates: [340, 40],
    },
  }), [
    {
      type: 'Feature',
      properties: {
        type: 'extinguisher',
      },
      geometry: {
        type: 'Point',
        coordinates: [-20, 40],
      },
    },
  ], 'returns unchanged');
  assert.end();
});

test('MultiPoint', function(assert) {
  assert.deepEqual(stackerOfWorlds({
    type: 'Feature',
    properties: {
      id: 'fire',
      type: 'extinguisher',
    },
    geometry: {
      type: 'MultiPoint',
      coordinates: [
        [-340, 10],
        [616, 20],
        [0, -20],
      ],
    },
  }), [
    {
      type: 'Feature',
      properties: {
        type: 'extinguisher',
      },
      geometry: {
        type: 'Point',
        coordinates: [20, 10],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'extinguisher',
      },
      geometry: {
        type: 'Point',
        coordinates: [0, -20],
      },
    },
    {
      type: 'Feature',
      properties: {
        type: 'extinguisher',
      },
      geometry: {
        type: 'Point',
        coordinates: [-104, 20],
      },
    },
  ], 'returns one feature per world');
  assert.end();
});
