'use strict';

const test = require('tap').test;
const fs = require('fs');
const path = require('path');
const stackerOfWorlds = require('..');

const srcDir = path.join(__dirname, './fixtures/src');
const expectedDir = path.join(__dirname, './fixtures/expected');
const srcFixtures = fs.readdirSync(srcDir);

srcFixtures.forEach((filename) => {
  const getActual = new Promise((resolve, reject) => {
    fs.readFile(path.join(srcDir, filename), 'utf8', (err, geojson) => {
      if (err) return reject(err);
      resolve(stackerOfWorlds.stack(JSON.parse(geojson)));
    });
  });

  const getExpected = new Promise((resolve, reject) => {
    fs.readFile(path.join(expectedDir, filename), 'utf8', (err, geojson) => {
      if (err) return reject(err);
      resolve(JSON.parse(geojson));
    });
  });

  test(filename, (t) => {
    Promise.all([getActual, getExpected]).then((results) => {
      const actual = results[0];
      const expected = results[1];
      t.deepEqual(actual, expected);
      t.end();
    });
  });
});
