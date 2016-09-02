# stacker-of-worlds

Stack GeoJSON spanning multiple worlds onto the One True World of CRS84 — that is, with all longitudes contained between -180 and +180.

By different "worlds" I mean different 360 degree segments of an infinite longitudinal range: -180 to +180, 180 to 540, 540 to 900, -540 to -180, -900 to -540, etc.

## How it works

Accepts a GeoJSON Feature or FeatureCollection and returns a new Feature or FeatureCollection representing the same information but with the following transformations to ensure coordinates fall within real longitudes (applied to the sole Feature or else to every Feature in the FeatureCollection):

- If the Feature exists completely *inside* +/-180, leave it as it is.
- If the Feature exists completely *outside* +/-180, translate its coordinates over to the One True World.
- If the Feature spans any number of datelines in any number of "worlds", split it at the datelines to create one geometry for each world, translate each geometry's coordinates to the One True World, then combine all the translated coordinates into a Multi* Feature.

## Usage

### CLI

```
Usage
  stacker-of-worlds <input> <output> <options>

  If no input is provided, stdin is used.
  If no output is provided, stdout is used.

Options
  --pretty, -p    Write JSON within line breaks and indentation.

Example
  stacker-of-worlds ./foo.geojson ./stacked/stacked-foo.geojson --pretty
```

### Node

**stackerOfWords.stack(geojsonObject)**

That's an *object* as opposed to a string. Returns the stacked GeoJSON (also as an object).

```js
const stackerOfWords = require('stacker-of-worlds');
const myWorldSpanningFeature = require('my-world-spanning-feature.geojson');
const realWorldFeature = stackerOfWords.stack(myWorldSpanningFeature);
```
