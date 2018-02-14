const path = require('path')

module.exports = {
  entry: "./src/api-getter.js", // string | object | array
  // Here the application starts executing
  // and webpack starts bundling

  output: {
    path: path.resolve(__dirname, "dist"), // string
    // the target directory for all output files
    // must be an absolute path (use the Node.js path module)

    filename: "bundle.js", // string
    // the filename template for entry chunks

    library: "Piton", // string,
    // the name of the exported library

    libraryTarget: "umd" // universal module definition
  },

  target: "web" // enum
}
