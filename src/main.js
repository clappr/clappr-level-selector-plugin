var UiCorePlugin = require('ui_core_plugin')
var JST = require('.././jst')
var Styler = require('./styler')
var version = require('../package.json').version
var Events = Clappr.Events

class LevelSelector extends UiCorePlugin {

  static get version() { return version }

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
      this.init()
    }
    super(core)
  }

  init() {
    this.levels = {}
    this.auto_level = true
    this.selected_level = -1
  }

  reload() {
    this.unBindEvents()
    this.init()
    this.bindEvents()
  }

  bindEvents() {
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.reload)
    if (this.isEnabled()) {
      this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
      Clappr.Mediator.on(this.getContainer().playback.uniqueId + ":fragmentloaded", () => this.onFragmentLoaded())
      Clappr.Mediator.on(this.getContainer().playback.uniqueId + ':levelchanged', (isHD) => this.onLevelChanged(isHD))
    }
  }

  unBindEvents() {
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED)
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_RENDERED)
    Clappr.Mediator.off(this.getContainer().playback.uniqueId + ":fragmentloaded")
    Clappr.Mediator.off(this.getContainer().playback.uniqueId + ':levelchanged')
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
    this.levels = this.getContainer().playback.el.globoGetLevels()
    Clappr.Mediator.off(this.getContainer().playback.uniqueId + ":fragmentloaded")
    this.render()
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

  getContainer() {
    return this.core.mediaControl.container
  }

  getCurrentLevel() {
    return this.getContainer().playback.el.globoGetLevel()
  }

  setLevel(level) {
    this.getContainer().playback.el.globoPlayerSmoothSetLevel(level)
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
