'use strict';

const fs = require('fs');
const stream = require('stream');
const crypto = require('crypto');
const path = require('path');
const os = require('os');
const fasterror = require('fasterror');
const geojsonStream = require('geojson-stream');
const split = require('split');
const geojsonStringExceedsBounds = require('./util/geojsonStringExceedsBounds');
const stackFeature = require('./stackFeature');

const BoundsError = fasterror('BoundsError');

/**
 * Read a GeoJSON file and return streaming GeoJSON string with stacked
 * features.
 *
 * @param {string} infile
 * @return {Readable}
 */
function stackFile(infile, options) {
  options = options || {};
  const outfile = options.outfile || path.join(os.tmpdir(), crypto.randomBytes(8).toString('hex'));
  const firstRead = fs.createReadStream(infile);
  const secondRead = fs.createReadStream(infile, 'utf8');
  const parser = geojsonStream.parse();
  const stringifier = geojsonStream.stringify();
  const writer = fs.createWriteStream(outfile);

  const coordinateChecker = new stream.Writable({
    write(chunk, encoding, callback) {
      if (geojsonStringExceedsBounds(chunk)) {
        callback(new BoundsError());
      } else {
        callback();
      }
    },
  });

  const stacker = new stream.Transform({
    objectMode: true,
    transform: (feature, enc, callback) => {
      callback(null, stackFeature(feature));
    },
  });

  const stackEm = () => {
    secondRead
      .pipe(parser)
      .pipe(stacker)
      .pipe(stringifier)
      .pipe(writer);
  };

  return new Promise((resolve, reject) => {
    firstRead.on('error', reject);
    secondRead.on('error', reject);
    stacker.on('error', reject);
    parser.on('error', reject);
    writer.on('error', reject);
    writer.on('finish', () => resolve(outfile));

    coordinateChecker.on('error', (err) => {
      if (err instanceof BoundsError) {
        stackEm();
      } else {
        reject(err);
      }
    });

    // If the coordinate checker found no out-of-bounds coordinates,
    // resolve with the original filepath
    coordinateChecker.on('finish', () => resolve(infile));

    firstRead
      .pipe(split())
      .pipe(coordinateChecker);
  });
}

module.exports = stackFile;
