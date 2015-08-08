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
      this.listenTo(this.getPlayback(), Events.PLAYBACK_FRAGMENT_LOADED, this.onFragmentLoaded)
      this.listenTo(this.getContainer(), Events.CONTAINER_BITRATE, (bitrate) => this.onLevelChanged(bitrate.level))
    }
  }

  unBindEvents() {
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED)
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_RENDERED)
    this.stopListening(this.getPlayback(), Events.PLAYBACK_FRAGMENT_LOADED)
    this.stopListening(this.getContainer(), Events.CONTAINER_BITRATE)
  }

  render() {
    if (this.isEnabled()) {
      this.$el.html(this.template({'levels':this.levels, 'current_level': 0}))
      var style = Styler.getStyleFor(this.name)
      this.$el.append(style)
      this.core.mediaControl.$el.find('.media-control-right-panel').append(this.el)
      this.updateText(this.currentLevel)
      return this
    }
  }

  isEnabled() {
    return this.core.mediaControl.container.playback.name === 'hls'
  }

  onFragmentLoaded() {
    this.levels = this.getContainer().playback.getLevels()
    Clappr.Mediator.off(this.getContainer().playback.cid + ":fragmentloaded")
    this.render()
  }

  onLevelChanged(level) {
    if (level !== undefined) {
      this.currentLevel = level
      this.updateText(level)
      if (this.selectedIsCurrent(level)) {
        this.stopAnimation()
      }
    }
  }

  onLevelSelect(event) {
    this.selected_level = parseInt(event.target.dataset.levelSelectorSelect, 10)
    this.auto_level = (this.selected_level === -1)
    this.setLevel(this.selected_level)
    this.toggleContextMenu()
    if (this.auto_level || this.selectedIsCurrent()) {
      this.updateText(this.selected_level)
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
    return this.core.getCurrentContainer()
  }

  getPlayback() {
    if (this.getContainer()) {
      return this.getContainer().playback
    }
    return null
  }

  getCurrentLevel() {
    return this.currentLevel = (this.currentLevel || this.getPlayback().getCurrentLevelIndex())
  }

  setLevel(level) {
    this.getPlayback().setCurrentLevel(level)
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

  selectedIsCurrent(currentLevel = this.getCurrentLevel()) {
    return (this.selected_level === currentLevel)
  }

  updateText(level) {
    if (level === undefined || level === -1) {
      level = this.getCurrentLevel()
    }
    if (this.levels[level]) {
      var display_text = Math.floor(this.levels[level].bitrate / 1000)
      display_text += 'kbps'
      if (this.auto_level) {
        display_text = 'AUTO (' + display_text + ')'
      }
      this.buttonElement().text(display_text)
    }
  }
}

module.exports = window.LevelSelector = LevelSelector
