'use strict';

const fs = require('fs');
const path = require('path');
const stackFile = require('../lib/stackFile');

const getFixturePath = (name) => path.join(__dirname, 'fixtures', `${name}.geojson`);

const loadResult = (filepath) => {
  return new Promise((resolve, reject) => {
    fs.readFile(filepath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

describe('stackFile', () => {
  it('featurecollection-multiworld', () => {
    return stackFile(getFixturePath('featurecollection-multiworld')).then((filepath) => {
      expect(typeof filepath).toBe('string');
      return loadResult(filepath);
    }).then((actual) => {
      expect(actual).toMatchSnapshot();
    });
  });
});
