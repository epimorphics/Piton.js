# Piton.js

**Note: 8 Sept, 2021** We're not actively maintaining this code any more, so we are putting this repo into archive mode. If anyone would like to assume ownership and maintenance for this code, please [let us know](mailto:info@epimorphics.com).

![A Piton](piton.png)

Piton.js builds a consistent platform on which to use data retrieved from a JSON-LD Restful API.

Piton supports a Promise-based interface for loading JSON Linked Data documents and expanding links.

## Usage
`processAPIResponse (obj, definitions [, hops])`

obj - `{}` Object to process.

definitions - `{}` Schema definitions object

hops - `Number` [Optional] Max number of hops to populate in the graph. A hop is any remote id loaded.

Returns `Promise` containing JSON representation of object.

## Schema
A schema object is used to map JSON-LD 'types' to a set of transforms.

#### Statics
These are used as a prototype for the resulting object. Useful for adding strings to an object. Also used for defining default types for other properties. By setting a static with an array value any result pulled from props will also be an array.

#### Props
Props are key, value pairs of what to dynamically pull from the API result. These support JS dot notation and any other accessor method supported by Lodash 'get()'.

#### Required
The final processing of the resulting objects is to check if there's a value for every field name in the required array. Throws Error if not.

```
"http://environment.data.gov.uk/catchment-planning/def/water-framework-directive/RiverBasinDistrict": {
  "statics": {
    "slug": "RiverBasinDistrict",
    "measures": []
  },
  "props": {
    "label": "label",
    "notation": "notation",
    "measures": "measures"
  },
  "required": ["label", "notation", "slug", "type"]
}
```

## Why
This was developed to provide a consistent representation of a JSON-LD API. Especially useful in a 'dumb json' templating environment like Vue JS.

## Future Development
* Reject Promise in a native way
* Add tests
