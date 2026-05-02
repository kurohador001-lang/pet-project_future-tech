class Header {

	selectors = {
		header: '[data-js-header]',
		burgerButton: '[data-js-header-burger-button]',
		overlay: '[data-js-header-overlay]',
	}

	stateClasses = {
		isActive: 'is-active',
		isLock: 'is-lock',
	}

	constructor() {
		this.headerElement = document.querySelector(this.selectors.header)
		this.burgerButtonElement = this.headerElement.querySelector(this.selectors.burgerButton)
		this.overlayElement = this.headerElement.querySelector(this.selectors.overlay)

		this.bindEvents()
	}

	onBurgerButtonClick() {
		this.burgerButtonElement.classList.toggle(this.stateClasses.isActive)
		this.overlayElement.classList.toggle(this.stateClasses.isActive)
		document.documentElement.classList.toggle(this.stateClasses.isLock)
	}

	bindEvents() {
		this.burgerButtonElement.addEventListener('click', () => {
			this.onBurgerButtonClick()
		})
	}
}

export default Header