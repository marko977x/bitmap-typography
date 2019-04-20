const path = require("path");

module.exports = {
    entry: "./src/js/app.js",
    devtool: "inline-source-map",
    mode: "development",
    output: {
        path: path.resolve(__dirname, "dist"),
        publicPath: "dist",
        filename: "bundle.js"
    }
};