# stacker-of-worlds

Stack GeoJSON spanning multiple worlds onto the One True World of CRS84 — that is, with all longitudes contained between -180 and +180.

By different "worlds" I mean different 360 degree segments of an infinite longitudinal range: -180 to +180, 180 to 540, 540 to 900, -540 to -180, -900 to -540, etc.

## How it works

The module exposes a `stack` function that accepts a GeoJSON Feature or FeatureCollection and returns a new Feature or FeatureCollection representing the same information but with the following transformations to ensure coordinates fall within real longitudes (applied to the sole Feature or else to every Feature in the FeatureCollection):

- If the Feature exists completely *inside* +/-180, leave it as it is.
- If the Feature exists completely *outside* +/-180, translate its coordinates over to the One True World.
- If the Feature spans any number of datelines in any number of "worlds", split it at the datelines to create one geometry for each world, translate each geometry's coordinates to the One True World, then combine all the translated coordinates into a Multi* Feature.

## Usage

```js
const stackerOfWords = require('stacker-of-worlds');
const myWorldSpanningFeature = require('my-world-spanning-feature.geojson');
const realWorldFeature = stackerOfWords.stack(myWorldSpanningFeature);
```
