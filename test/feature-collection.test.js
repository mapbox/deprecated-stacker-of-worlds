'use strict';

const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const stackerOfWorlds = require('..');

function fixture(name) {
  return JSON.parse(fs.readFileSync(path.join(__dirname, './fixtures/', name)));
}

test('multiworld FeatureCollection', function(assert) {
  const input = fixture('otherworldly-feature-collection.geojson');
  const actual = stackerOfWorlds(input);
  const expected = fixture('oneworld-feature-collection.geojson');

  console.log(JSON.stringify(actual, null, 2))

  assert.deepEqual(actual, expected, 'correct output');
  assert.end();
});
