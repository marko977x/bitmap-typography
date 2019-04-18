const path = require("path");

module.exports = {
    entry: "./src/js/index.js",
    devtool: "inline-source-map",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist",
        filename: "bundle.js"
    }
};