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
      this.selected_level = -1
      this.container = core.mediaControl.container
      super(core)
    }
  }

  bindEvents() {
    if (this.isEnabled()) {
      this.listenTo(this.core.mediaControl, "mediacontrol:rendered", this.render)
      Clappr.Mediator.on(this.container.playback.uniqueId + ":fragmentloaded", () => this.onFragmentLoaded())
      Clappr.Mediator.on(this.container.playback.uniqueId + ':levelchanged', (isHD) => this.onLevelChanged(isHD))
    }
  }

  render() {
    if (this.isEnabled()) {
      this.$el.html(this.template({'levels':this.levels, 'current_level': 0}))
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

  onLevelChanged(isHD = false) {
    this.updateText()
    if (this.selectedIsCurrent()) {
      this.stopAnimation()
    }
  }

  onLevelSelect(event) {
    this.selected_level = parseInt(event.target.dataset.levelSelectorSelect, 10)
    this.auto_level = (this.selected_level === -1)
    this.setLevel(this.selected_level)
    this.toggleContextMenu()
    if (this.auto_level || this.selectedIsCurrent()) {
      this.updateText()
    } else {
      this.startAnimation()
      this.updateText(this.selected_level)
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
    return this.container.playback.el.globoGetLevel()
  }

  setLevel(level) {
    this.container.playback.el.globoPlayerSmoothSetLevel(level)
  }

  buttonElement() {
    return this.$el.find('.level_selector button')
  }

  startAnimation() {
    this.buttonElement().addClass('changing')
  }

  stopAnimation() {
    this.buttonElement().removeClass('changing')
  }

  selectedIsCurrent() {
    return (this.selected_level === this.getCurrentLevel())
  }

  updateText(level = undefined) {
    if (!level) {
      level = this.getCurrentLevel()
    }
    var display_text = Math.floor(this.levels[level].bitrate / 1000)
    display_text += 'kbps'
    if (this.auto_level) {
      display_text = 'AUTO (' + display_text + ')'
    }
    this.buttonElement().text(display_text)
  }
}

module.exports = window.LevelSelector = LevelSelector
