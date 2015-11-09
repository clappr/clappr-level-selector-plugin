import {Events, Styler, UICorePlugin, template} from 'Clappr'
import pluginHtml from './public/level-selector.html'
import pluginStyle from './public/style.scss'

class LevelSelector extends UICorePlugin {

  static get version() { return VERSION }

  get name() { return 'level_selector' }
  get template() { return template(pluginHtml) }

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
    super(core)
    this.init()
    this.render()
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
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
    this.listenToOnce(this.getPlayback(), Events.PLAYBACK_FRAGMENT_LOADED, this.onFragmentLoaded)
    this.listenTo(this.getContainer(), Events.CONTAINER_BITRATE, (bitrate) => this.onLevelChanged(bitrate.level))
  }

  unBindEvents() {
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED)
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_RENDERED)
    this.stopListening(this.getContainer(), Events.CONTAINER_BITRATE)
  }

  render() {
    if (this.isEnabled()) {
      this.$el.html(this.template({'levels':this.levels, 'current_level': 0}))
      var style = Styler.getStyleFor(pluginStyle, {baseUrl: this.core.options.baseUrl})
      this.$el.append(style)
      this.core.mediaControl.$el.find('.media-control-right-panel').append(this.el)
      this.updateText(this.currentLevel)
      return this
    }
  }

  isEnabled() {
    return this.levels
  }

  onFragmentLoaded() {
    this.levels = this.getContainer().playback.levels
    this.render()
  }

  onLevelChanged(level) {
    if (level !== undefined) {
      this.currentLevel = level
      this.updateText(level)
      if (this.auto_level || this.selectedIsCurrent(level)) {
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
    return this.currentLevel = (this.currentLevel || this.getPlayback().currentLevel)
  }

  setLevel(level) {
    this.getPlayback().currentLevel = level
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
