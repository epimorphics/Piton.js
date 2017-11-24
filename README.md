# JSON-LD Js Api
The aim of this project is to build a consistent platform on which to download data from a JSON-LD Resful API.

Objects are defined in a JSON document, which is then used after querying the API to shape the result in a consistent shape.

## Usage
`processAPIResponse (obj, definitions [, hops])`

obj - `{}` Object to process.

definitions - `{}` Schema definitions object

hops - `Number` [Optional] Max number of hops to populate in the graph

Returns `Promise` containing JSON representation of object

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
  },
  "props": {
    "label": "label",
    "notation": "notation"
  },
  "required": ["label", "notation", "slug", "type"]
}
```

## Why
This was developed to provide a consistent representation of a JSON-LD API. Especially useful in a 'dumb json' templating environment like Vue JS.
