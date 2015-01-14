var $ = require('zepto');
var _ = require('underscore');
var JST = require('.././jst');

var Styler = {
  getStyleFor: function(name, options) {
    options = options || {};
    return $('<style></style>').html(_.template(JST.CSS[name])(options));
  }
};

module.exports = Styler;
