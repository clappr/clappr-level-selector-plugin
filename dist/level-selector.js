(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("Clappr"));
	else if(typeof define === 'function' && define.amd)
		define(["Clappr"], factory);
	else if(typeof exports === 'object')
		exports["LevelSelector"] = factory(require("Clappr"));
	else
		root["LevelSelector"] = factory(root["Clappr"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_2__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "<%=baseUrl%>/";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	module.exports = __webpack_require__(1);

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

	var _Clappr = __webpack_require__(2);

	var _levelSelector = __webpack_require__(3);

	var _levelSelector2 = _interopRequireDefault(_levelSelector);

	var _style = __webpack_require__(4);

	var _style2 = _interopRequireDefault(_style);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

	function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

	function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

	var LevelSelector = (function (_UICorePlugin) {
	  _inherits(LevelSelector, _UICorePlugin);

	  _createClass(LevelSelector, [{
	    key: 'name',
	    get: function get() {
	      return 'level_selector';
	    }
	  }, {
	    key: 'template',
	    get: function get() {
	      return (0, _Clappr.template)(_levelSelector2.default);
	    }
	  }, {
	    key: 'attributes',
	    get: function get() {
	      return {
	        'class': this.name,
	        'data-level-selector': ''
	      };
	    }
	  }, {
	    key: 'events',
	    get: function get() {
	      return {
	        'click [data-level-selector-select]': 'onLevelSelect',
	        'click [data-level-selector-button]': 'onShowLevelSelectMenu'
	      };
	    }
	  }], [{
	    key: 'version',
	    get: function get() {
	      return ("0.1.0");
	    }
	  }]);

	  function LevelSelector(core) {
	    _classCallCheck(this, LevelSelector);

	    var _this = _possibleConstructorReturn(this, Object.getPrototypeOf(LevelSelector).call(this, core));

	    _this.init();
	    _this.render();
	    return _this;
	  }

	  _createClass(LevelSelector, [{
	    key: 'init',
	    value: function init() {
	      this.levels = {};
	      this.auto_level = true;
	      this.selected_level = -1;
	    }
	  }, {
	    key: 'reload',
	    value: function reload() {
	      this.unBindEvents();
	      this.init();
	      this.bindEvents();
	    }
	  }, {
	    key: 'bindEvents',
	    value: function bindEvents() {
	      var _this2 = this;

	      this.listenTo(this.core.mediaControl, _Clappr.Events.MEDIACONTROL_CONTAINERCHANGED, this.reload);
	      this.listenTo(this.core.mediaControl, _Clappr.Events.MEDIACONTROL_RENDERED, this.render);
	      this.listenToOnce(this.getPlayback(), _Clappr.Events.PLAYBACK_FRAGMENT_LOADED, this.onFragmentLoaded);
	      this.listenTo(this.getContainer(), _Clappr.Events.CONTAINER_BITRATE, function (bitrate) {
	        return _this2.onLevelChanged(bitrate.level);
	      });
	    }
	  }, {
	    key: 'unBindEvents',
	    value: function unBindEvents() {
	      this.stopListening(this.core.mediaControl, _Clappr.Events.MEDIACONTROL_CONTAINERCHANGED);
	      this.stopListening(this.core.mediaControl, _Clappr.Events.MEDIACONTROL_RENDERED);
	      this.stopListening(this.getContainer(), _Clappr.Events.CONTAINER_BITRATE);
	    }
	  }, {
	    key: 'render',
	    value: function render() {
	      if (this.isEnabled()) {
	        this.$el.html(this.template({ 'levels': this.levels, 'current_level': 0 }));
	        var style = _Clappr.Styler.getStyleFor(_style2.default, { baseUrl: this.core.options.baseUrl });
	        this.$el.append(style);
	        this.core.mediaControl.$el.find('.media-control-right-panel').append(this.el);
	        this.updateText(this.currentLevel);
	        return this;
	      }
	    }
	  }, {
	    key: 'isEnabled',
	    value: function isEnabled() {
	      return this.levels;
	    }
	  }, {
	    key: 'onFragmentLoaded',
	    value: function onFragmentLoaded() {
	      this.levels = this.getContainer().playback.levels;
	      this.render();
	    }
	  }, {
	    key: 'onLevelChanged',
	    value: function onLevelChanged(level) {
	      if (level !== undefined) {
	        this.currentLevel = level;
	        this.updateText(level);
	        if (this.auto_level || this.selectedIsCurrent(level)) {
	          this.stopAnimation();
	        }
	      }
	    }
	  }, {
	    key: 'onLevelSelect',
	    value: function onLevelSelect(event) {
	      this.selected_level = parseInt(event.target.dataset.levelSelectorSelect, 10);
	      this.auto_level = this.selected_level === -1;
	      this.setLevel(this.selected_level);
	      this.toggleContextMenu();
	      if (this.auto_level || this.selectedIsCurrent()) {
	        this.updateText(this.selected_level);
	      } else {
	        this.startAnimation();
	        this.updateText(this.selected_level);
	      }
	      event.stopPropagation();
	      return false;
	    }
	  }, {
	    key: 'onShowLevelSelectMenu',
	    value: function onShowLevelSelectMenu(event) {
	      this.toggleContextMenu();
	    }
	  }, {
	    key: 'toggleContextMenu',
	    value: function toggleContextMenu() {
	      this.$el.find('.level_selector ul').toggle();
	    }
	  }, {
	    key: 'getContainer',
	    value: function getContainer() {
	      return this.core.getCurrentContainer();
	    }
	  }, {
	    key: 'getPlayback',
	    value: function getPlayback() {
	      if (this.getContainer()) {
	        return this.getContainer().playback;
	      }
	      return null;
	    }
	  }, {
	    key: 'getCurrentLevel',
	    value: function getCurrentLevel() {
	      return this.currentLevel = this.currentLevel || this.getPlayback().currentLevel;
	    }
	  }, {
	    key: 'setLevel',
	    value: function setLevel(level) {
	      this.getPlayback().currentLevel = level;
	    }
	  }, {
	    key: 'buttonElement',
	    value: function buttonElement() {
	      return this.$el.find('.level_selector button');
	    }
	  }, {
	    key: 'startAnimation',
	    value: function startAnimation() {
	      this.buttonElement().addClass('changing');
	    }
	  }, {
	    key: 'stopAnimation',
	    value: function stopAnimation() {
	      this.buttonElement().removeClass('changing');
	    }
	  }, {
	    key: 'selectedIsCurrent',
	    value: function selectedIsCurrent() {
	      var currentLevel = arguments.length <= 0 || arguments[0] === undefined ? this.getCurrentLevel() : arguments[0];

	      return this.selected_level === currentLevel;
	    }
	  }, {
	    key: 'updateText',
	    value: function updateText(level) {
	      if (level === undefined || level === -1) {
	        level = this.getCurrentLevel();
	      }
	      if (this.levels[level]) {
	        var display_text = Math.floor(this.levels[level].bitrate / 1000);
	        display_text += 'kbps';
	        if (this.auto_level) {
	          display_text = 'AUTO (' + display_text + ')';
	        }
	        this.buttonElement().text(display_text);
	      }
	    }
	  }]);

	  return LevelSelector;
	})(_Clappr.UICorePlugin);

	module.exports = window.LevelSelector = LevelSelector;

/***/ },
/* 2 */
/***/ function(module, exports) {

	module.exports = __WEBPACK_EXTERNAL_MODULE_2__;

/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = "<button data-level-selector-button>Auto</button><ul><li><a href=# data-level-selector-select=-1>AUTO</a></li><% for (var i = 0; i < levels.length; i++) { %><li><a href=# data-level-selector-select=\"<%= i %>\"><%= Math.floor(levels[i].bitrate / 1000) %>kbps</a></li><% }; %></ul>";

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(5)();
	// imports


	// module
	exports.push([module.id, ".level_selector[data-level-selector] {\n  float: right;\n  margin-top: 5px;\n  position: relative; }\n  .level_selector[data-level-selector] button {\n    background-color: transparent;\n    color: #fff;\n    font-family: Roboto,\"Open Sans\",Arial,sans-serif;\n    -webkit-font-smoothing: antialiased;\n    border: none;\n    font-size: 10px; }\n    .level_selector[data-level-selector] button:hover {\n      color: #c9c9c9; }\n    .level_selector[data-level-selector] button.changing {\n      -webkit-animation: pulse 0.5s infinite alternate; }\n  .level_selector[data-level-selector] > ul {\n    list-style-type: none;\n    position: absolute;\n    bottom: 25px;\n    border: 1px solid black;\n    display: none;\n    background-color: #e6e6e6; }\n  .level_selector[data-level-selector] li a {\n    color: #444;\n    padding: 2px 10px;\n    display: block;\n    text-decoration: none;\n    font-size: 10px; }\n  .level_selector[data-level-selector] li:hover {\n    background-color: #555;\n    color: white; }\n    .level_selector[data-level-selector] li:hover a {\n      color: white;\n      text-decoration: none; }\n\n@-webkit-keyframes pulse {\n  0% {\n    color: #fff; }\n  50% {\n    color: #ff0101; }\n  100% {\n    color: #B80000; } }\n", ""]);

	// exports


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function () {
		var list = [];

		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for (var i = 0; i < this.length; i++) {
				var item = this[i];
				if (item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};

		// import a list of modules into the list
		list.i = function (modules, mediaQuery) {
			if (typeof modules === "string") modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for (var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if (typeof id === "number") alreadyImportedModules[id] = true;
			}
			for (i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if (typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if (mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if (mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};

/***/ }
/******/ ])
});
;