const rootSelector = '[data-js-player]'

class VideoPlayer {
	selectors = {
		root: rootSelector,
		video: '[data-js-player-video]',
		playButton:'[data-js-player-button]',
		panel: '[data-js-player-panel]',
	}

	stateClasses = {
		isActive: 'is-active'
	}

	constructor(rootElement) {
		this.rootElement = rootElement
		this.videoElement = rootElement.querySelector(this.selectors.video)
		this.playButtonElement = rootElement.querySelector(this.selectors.playButton)
		this.panelElement = rootElement.querySelector(this.selectors.panel)
		this.bindEvents()
	}

	onVideoPause = () => {
		this.videoElement.controls = false
		this.panelElement.classList.add(this.stateClasses.isActive)
	}

	onPlayButtonClick = () => {
		this.videoElement.play()
		this.videoElement.controls = true
		this.panelElement.classList.remove(this.stateClasses.isActive)
	}

	bindEvents() {
		this.playButtonElement.addEventListener('click', this.onPlayButtonClick)
		this.videoElement.addEventListener('pause', this.onVideoPause)
	}
}

class VideoPlayerCollection {
	constructor() {
		this.init()
	}

	init() {
		document.querySelectorAll(rootSelector).forEach((element) => {
			new VideoPlayer(element)
		})
	}
}

export default VideoPlayerCollection