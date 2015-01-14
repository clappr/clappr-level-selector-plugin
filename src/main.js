var UiCorePlugin = require('ui_core_plugin')
var JST = require('.././jst')
var Styler = require('./styler')

class LevelSelector extends UiCorePlugin {

  get name() { return 'level_selector' }
  get template() { return JST.level_selector }

  get attributes() {
    return {
      'class': this.name,
      'data-level-selector': ''
    }
  }

  get events() {
    return {
      'click [data-level-selector-select]': 'onLevelSelect',
      'click [data-level-selector-button]': 'onShowLevelSelectMenu'
    }
  }

  constructor(core) {
    this.core = core
    if (this.isEnabled()) {
      this.levels = {}
      this.auto_level = true
      this.current_level = 0
      this.container = core.mediaControl.container
      super(core)
    }
  }

  bindEvents() {
    if (this.isEnabled()) {
      this.listenTo(this.core.mediaControl, "mediacontrol:rendered", this.render)
      Clappr.Mediator.on(this.container.playback.uniqueId + ":fragmentloaded", () => this.onFragmentLoaded())
      Clappr.Mediator.on(this.container.playback.uniqueId + ':highdefinition', (isHD) => this.onLevelChanged(isHD))
    }
  }

  render() {
    if (this.isEnabled()) {
      this.$el.html(this.template({'levels':this.levels, 'current_level': this.current_level}))
      var style = Styler.getStyleFor(this.name)
      this.$el.append(style)
      this.core.mediaControl.$el.find('.media-control-right-panel').append(this.el)

      if (this.levels.length !== undefined) {
        this.onLevelChanged(false)
      }

      return this
    }
  }

  isEnabled() {
    return this.core.mediaControl.container.playback.name === 'hls'
  }

  onFragmentLoaded() {
    this.levels = this.container.playback.el.globoGetLevels()
    this.getCurrentLevel()
    Clappr.Mediator.off(this.container.playback.uniqueId + ":fragmentloaded")
  }

  onLevelChanged(isHD) {
    this.getCurrentLevel()
    var display_text = Math.floor(this.levels[this.current_level].bitrate / 1000)
    display_text += 'kbps'
    if (this.auto_level) {
      display_text = 'AUTO (' + display_text + ')'
    }
    this.$el.find('.level_selector button').text(display_text).removeClass('changing')
  }

  onLevelSelect(event) {
    var level = event.target.dataset.levelSelectorSelect
    this.auto_level = (level === "-1")
    this.container.playback.el.globoPlayerSmoothSetLevel(level)
    this.toggleContextMenu()
    if (level == this.getCurrentLevel()) {
      this.onLevelChanged(false)
    } else {
      this.$el.find('.level_selector button').addClass('changing')
    }
    event.stopPropagation()
    return false
  }

  onShowLevelSelectMenu(event) {
    this.toggleContextMenu()
  }

  toggleContextMenu() {
    this.$el.find('.level_selector ul').toggle()
  }

  getCurrentLevel() {
    this.current_level = this.container.playback.el.globoGetLevel()
    return this.current_level
  }
}

module.exports = window.LevelSelector = LevelSelector
