const rootSelector = '[data-js-input-mask]'

class InputMask {
	constructor(rootElement) {
		this.rootElement = rootElement
		this.init()
	}

	init() {
		const isLibInstall = window.IMask !== 'undefined'
		
		if (isLibInstall) {
			IMask(
				this.rootElement,
				{
					mask: this.rootElement.dataset.jsInputMask
				}
			)
		} else {
			console.error('Библиотека "IMask не установлена"')
		}
	}
}

class InputMaskCollection {
	constructor() {
		this.init()
	}

	init() {
		document.querySelectorAll(rootSelector).forEach((element) => {
			new InputMask(element)
		})
	}
}

export default InputMaskCollection