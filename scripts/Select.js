import BaseComponent from "./BaseComponent.js";
import MatchMedia from "./MatchMedia.js";

const rootSelector = "[data-js-select]";

class Select extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: "[data-js-select-button]",
    dropdown: "[data-js-select-dropdown]",
    option: "[data-js-select-option]",
  };

  stateClasses = {
    isExpanded: "is-expanded",
    isCurrent: "is-current",
    isSelected: "is-selected",
    isOnTheLeftSide: "is-on-the-left-side",
    isOnTheRightSide: "is-on-the-right-side",
  };

  stateAttributes = {
    ariaSelected: "aria-selected",
    ariaExpanded: "aria-expanded",
    ariaActiveDescendant: "aria-activedescendant",
  };

  initialState = {
    isExpanded: false,
    currentOptionIndex: null,
    selectedOptionElement: null,
  };

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.buttonElement = this.rootElement.querySelector(this.selectors.button);
    this.dropdownElement = this.rootElement.querySelector(
      this.selectors.dropdown,
    );
    this.optionElements = this.dropdownElement.querySelectorAll(
      this.selectors.option,
    );
    this.currentOptionIndex = [...this.optionElements].findIndex((element) => {
      return element.classList.contains(this.stateClasses.isCurrent);
    });
    this.state = this.getProxyState({
      ...this.initialState,
      currentOptionIndex: this.currentOptionIndex,
      selectedOptionElement: this.optionElements[this.currentOptionIndex],
    });

    this.fixDropDownPosition();
    this.bindEvents();
  }

  fixDropDownPosition() {
    const fullViewportWidth = document.documentElement.clientWidth;
    const halfFullViewportWidth = fullViewportWidth / 2;
    const { width, x } = this.buttonElement.getBoundingClientRect();
    const buttonCenterX = x + width / 2;
    const isButtonOnTheLeftSide = buttonCenterX < halfFullViewportWidth;

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheLeftSide,
      isButtonOnTheLeftSide,
    );

    this.dropdownElement.classList.toggle(
      this.stateClasses.isOnTheRightSide,
      !isButtonOnTheLeftSide,
    );
  }

  toggleExpandedState() {
    this.state.isExpanded = !this.state.isExpanded;
  }

  onButtonClick = () => {
    this.toggleExpandedState();
  };

  updateUI() {
    const { isExpanded, currentOptionIndex, selectedOptionElement } =
      this.state;

    const newSelectionOptionValue = selectedOptionElement.innerHTML;

    const updateButton = () => {
      this.buttonElement.innerHTML = newSelectionOptionValue;
      this.buttonElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded,
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaExpanded,
        isExpanded,
      );
      this.buttonElement.setAttribute(
        this.stateAttributes.ariaActiveDescendant,
        this.optionElements[currentOptionIndex].id,
      );
    };
    const updateDropdown = () => {
      this.dropdownElement.classList.toggle(
        this.stateClasses.isExpanded,
        isExpanded,
      );
    };
    const updateOptions = () => {
      this.optionElements.forEach((optionElement, index) => {
        const isSelected = optionElement === selectedOptionElement;
        const isCurrent = currentOptionIndex === index;

        optionElement.classList.toggle(
          this.stateClasses.isSelected,
          isSelected,
        );
        optionElement.classList.toggle(this.stateClasses.isCurrent, isCurrent);
        optionElement.setAttribute(
          this.stateAttributes.ariaSelected,
          isSelected,
        );
      });
    };

    updateButton();
    updateDropdown();
    updateOptions();
  }

  onClick = (event) => {
    const { target } = event;
    const isButtonClick =
      target.closest(this.selectors.button) === this.buttonElement;
    const isOutsideDropdownClick =
      target.closest(this.selectors.dropdown) !== this.dropdownElement;

    if (isOutsideDropdownClick && !isButtonClick) {
      this.collapse();
      return;
    }

    const isOptionClick = target.matches(this.selectors.option);

    if (isOptionClick) {
      this.state.selectedOptionElement = target;
      this.state.currentOptionIndex = [...this.optionElements].findIndex(
        (optionElement) => optionElement === target,
      );
      this.collapse();
    }
  };

  get isNeedToExpand() {
    const isButtonFocused = document.activeElement === this.buttonElement;

    return isButtonFocused && !this.state.isExpanded;
  }

  expand() {
    this.state.isExpanded = true;
  }

  collapse() {
    this.state.isExpanded = false;
  }

  currentSelectedOption() {
    this.state.selectedOptionElement =
      this.optionElements[this.state.currentOptionIndex];
  }

  onArrowDownKeyDown = (altKey) => {
    if (this.isNeedToExpand) {
      this.expand();

      return;
    }

    if (altKey) {
      this.state.currentOptionIndex = this.optionElements.length - 1;
    }

    if (this.state.currentOptionIndex < this.optionElements.length - 1) {
      this.state.currentOptionIndex++;
    }
  };

  onArrowUpKeyDown = (altKey) => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    if (altKey) {
      this.state.currentOptionIndex = 0;
    }

    if (this.state.currentOptionIndex > 0) {
      this.state.currentOptionIndex--;
    }
  };

  onEnterKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.currentSelectedOption();
    this.collapse();
  };

  onEscapeKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.collapse();
  };

  onSpaceKeyDown = () => {
    if (this.isNeedToExpand) {
      this.expand();
      return;
    }

    this.currentSelectedOption();
    this.collapse();
  };

  onKeyDown = (event) => {
    const { code, altKey } = event;

    const actions = {
      ArrowDown: this.onArrowDownKeyDown,
      ArrowUp: this.onArrowUpKeyDown,
      Enter: this.onEnterKeyDown,
      Escape: this.onEscapeKeyDown,
      Space: this.onSpaceKeyDown,
    }[code];

    if (actions) {
      event.preventDefault();
      actions(altKey);
    }
  };

  onMobileSMatchMediaChange = () => {
    this.fixDropDownPosition();
  };

  bindEvents() {
    this.buttonElement.addEventListener("click", this.onButtonClick);
    document.addEventListener("click", this.onClick);
    this.rootElement.addEventListener("keydown", this.onKeyDown);
    MatchMedia.mobileS.addEventListener(
      "change",
      this.onMobileSMatchMediaChange,
    );
  }
}

class SelectCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Select(element);
    });
  }
}

export default SelectCollection;
