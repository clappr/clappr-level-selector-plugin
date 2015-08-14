var JST = require('.././jst');
var $ = require('clappr-zepto');

var Styler = {
  getStyleFor: function(name) {
    return $('<style></style>').html(JST.CSS[name].toString());
  }
};

module.exports = Styler;
