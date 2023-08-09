var r_layout = require("./index");

module.exports = function(eyeglass, sass) {
  return {
    sassDir: r_layout.includePaths[0]
  };
};