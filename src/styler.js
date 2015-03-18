var JST = require('.././jst');
var $ = require('zepto');

var Styler = {
  getStyleFor: function(name) {
    return $('<style>').html(JST.CSS[name]);
  }
};

module.exports = Styler;
