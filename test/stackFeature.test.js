'use strict';

const fs = require('fs');
const path = require('path');
const stackFeature = require('../lib/stackFeature');

const fixturesToLoad = [
  'point-realworld',
  'point-otherworld',
  'line-realworld',
  'line-otherworld',
  'line-multiworld-small',
  'line-multiworld-large',
  'polygon-realworld',
  'polygon-otherworld',
  'polygon-multiworld-small',
  'polygon-multiworld-large',
  'polygon-multiworld-huge',
  'multipoint-multiworld',
  'multiline-multiworld',
  'multipolygon-multiworld',
  'featurecollection-multiworld',
];

const loadFixture = (name) => {
  const fixturePath = path.join(__dirname, 'fixtures', `${name}.geojson`);
  return new Promise((resolve, reject) => {
    fs.readFile(fixturePath, 'utf8', (err, data) => {
      if (err) return reject(err);
      resolve(JSON.parse(data));
    });
  });
};

const fixtures = new Map();

describe('stackFeature', () => {
  beforeAll(() => {
    return Promise.all(fixturesToLoad.map((fixtureName) => {
      return loadFixture(fixtureName).then((json) => fixtures.set(fixtureName, json));
    }));
  });

  it('point-realworld', () => {
    expect(stackFeature(fixtures.get('point-realworld'))).toMatchSnapshot();
  });

  it('point-otherworld', () => {
    expect(stackFeature(fixtures.get('point-otherworld'))).toMatchSnapshot();
  });

  it('line-realworld', () => {
    expect(stackFeature(fixtures.get('line-realworld'))).toMatchSnapshot();
  });

  it('line-otherworld', () => {
    expect(stackFeature(fixtures.get('line-otherworld'))).toMatchSnapshot();
  });

  it('line-multiworld-small', () => {
    expect(stackFeature(fixtures.get('line-multiworld-small'))).toMatchSnapshot();
  });

  it('line-multiworld-large', () => {
    expect(stackFeature(fixtures.get('line-multiworld-large'))).toMatchSnapshot();
  });

  it('polygon-realworld', () => {
    expect(stackFeature(fixtures.get('polygon-realworld'))).toMatchSnapshot();
  });

  it('polygon-otherworld', () => {
    expect(stackFeature(fixtures.get('polygon-otherworld'))).toMatchSnapshot();
  });

  it('polygon-multiworld-small', () => {
    expect(stackFeature(fixtures.get('polygon-multiworld-small'))).toMatchSnapshot();
  });

  it('polygon-multiworld-large', () => {
    expect(stackFeature(fixtures.get('polygon-multiworld-large'))).toMatchSnapshot();
  });

  it('polygon-multiworld-huge', () => {
    expect(stackFeature(fixtures.get('polygon-multiworld-huge'))).toMatchSnapshot();
  });

  it('multipoint-multiworld', () => {
    expect(stackFeature(fixtures.get('multipoint-multiworld'))).toMatchSnapshot();
  });

  it('multiline-multiworld', () => {
    expect(stackFeature(fixtures.get('multiline-multiworld'))).toMatchSnapshot();
  });

  it('multipolygon-multiworld', () => {
    expect(stackFeature(fixtures.get('multipolygon-multiworld'))).toMatchSnapshot();
  });

  it('featurecollection-multiworld', () => {
    expect(stackFeature(fixtures.get('featurecollection-multiworld'))).toMatchSnapshot();
  });
});
