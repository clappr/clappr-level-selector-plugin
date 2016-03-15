import {Events, Styler, UICorePlugin, template} from 'Clappr'
import pluginHtml from './public/level-selector.html'
import pluginStyle from './public/style.scss'

const AUTO = -1

export default class LevelSelector extends UICorePlugin {

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

  bindEvents() {
    this.listenTo(this.core, Events.CORE_READY, this.bindPlaybackEvents)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED, this.reload)
    this.listenTo(this.core.mediaControl, Events.MEDIACONTROL_RENDERED, this.render)
  }

  get providedList() {
    var config = this.core.options.levelSelectorConfig
    return config && config.levels
  }

  unBindEvents() {
    this.stopListening(this.core, Events.CORE_READY)
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_CONTAINERCHANGED)
    this.stopListening(this.core.mediaControl, Events.MEDIACONTROL_RENDERED)
    if (!this.providedList) {
      this.stopListening(this.core.getCurrentPlayback(), Events.PLAYBACK_LEVELS_AVAILABLE)
      this.stopListening(this.core.getCurrentPlayback(), Events.PLAYBACK_LEVEL_SWITCH_START)
      this.stopListening(this.core.getCurrentPlayback(), Events.PLAYBACK_LEVEL_SWITCH_END)
    }
  }

  bindPlaybackEvents() {
      if (this.providedList) {
        this.fillLevels(this.providedList)
      } else {
        var currentPlayback = this.core.getCurrentPlayback()
        this.listenTo(currentPlayback, Events.PLAYBACK_LEVELS_AVAILABLE, this.fillLevels)
        this.listenTo(currentPlayback, Events.PLAYBACK_LEVEL_SWITCH_START, this.startLevelSwitch)
        this.listenTo(currentPlayback, Events.PLAYBACK_LEVEL_SWITCH_END, this.stopLevelSwitch)

        var playbackLevelsAvaialbeWasTriggered = currentPlayback.levels && currentPlayback.levels.length > 0
        playbackLevelsAvaialbeWasTriggered && this.fillLevels(currentPlayback.levels)
      }
  }

  reload() {
    this.unBindEvents()
    this.bindEvents()
  }

  shouldRender() {
    if (!this.core.getCurrentContainer()) return false

    var currentPlayback = this.core.getCurrentPlayback()
    if (!currentPlayback) return false

    var respondsToCurrentLevel = currentPlayback.currentLevel !== undefined
    var hasLevels = !!(this.levels && this.levels.length > 0)
    var hasProvidedLevels = !!(this.providedList && this.providedList.length > 0)

    return (respondsToCurrentLevel && hasLevels) || hasProvidedLevels
  }

  render() {
    if (this.shouldRender()) {
      var style = Styler.getStyleFor(pluginStyle, {baseUrl: this.core.options.baseUrl})

      this.$el.html(this.template({'levels':this.levels, 'title': this.getTitle()}))
      this.$el.append(style)
      this.core.mediaControl.$('.media-control-right-panel').append(this.el)
      this.updateText(this.selectedLevelId || AUTO)
    }
    return this
  }

  fillLevels(levels, initialLevel = AUTO) {
    this.selectedLevelId = initialLevel
    this.levels = levels
    this.configureLevelsLabels()
    this.render()
  }

  configureLevelsLabels() {
    if (this.core.options.levelSelectorConfig === undefined) return

    for (var levelId in (this.core.options.levelSelectorConfig.labels || {})) {
      levelId = parseInt(levelId, 10)
      var thereIsLevel = !!this.findLevelBy(levelId)
      thereIsLevel && this.changeLevelLabelBy(levelId, this.core.options.levelSelectorConfig.labels[levelId])
    }
  }

  findLevelBy(id) {
    var foundLevel
    this.levels.forEach((level) => { if (level.id === id) {foundLevel = level} })
    return foundLevel
  }

  changeLevelLabelBy(id, newLabel) {
    this.levels.forEach((level, index) => {
      if (level.id === id) {
        this.levels[index].label = newLabel
      }
    })
  }

  onLevelSelect(event) {
    this.selectedLevelId = parseInt(event.target.dataset.levelSelectorSelect, 10)
    if (this.providedList) {
      this.core.load(this.findLevelBy(this.selectedLevelId).src, undefined, {initialSeek: this.core.getCurrentContainer().getCurrentTime()})
    } else {
      this.core.getCurrentPlayback().currentLevel = this.selectedLevelId
    }

    this.toggleContextMenu()
    this.updateText(this.selectedLevelId)

    event.stopPropagation()
    return false
  }

  onShowLevelSelectMenu(event) { this.toggleContextMenu() }

  toggleContextMenu() { this.$('.level_selector ul').toggle() }

  buttonElement() { return this.$('.level_selector button') }

  getTitle() { return (this.core.options.levelSelectorConfig || {}).title }

  startLevelSwitch() { this.buttonElement().addClass('changing') }

  stopLevelSwitch() {
    this.buttonElement().removeClass('changing')
    this.updateText(this.selectedLevelId)
  }

  updateText(level) {
    if (level === AUTO && !this.providedList) {
      var playbackLevel = this.core.getCurrentPlayback().currentLevel;
      this.buttonElement().text((playbackLevel === AUTO) ? 'AUTO' : 'AUTO (' + this.findLevelBy(playbackLevel).label + ')')
    }
    else {
      this.buttonElement().text(this.findLevelBy(level).label)
    }
  }
}
