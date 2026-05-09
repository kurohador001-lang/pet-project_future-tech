import BaseComponent from "./BaseComponent.js";

const rootSelector = "[data-js-tabs]";

class Tabs extends BaseComponent {
  selectors = {
    root: rootSelector,
    button: "[data-js-tabs-button]",
    content: "[data-js-tabs-content]",
  };

  stateClasses = {
    isActive: "is-active",
  };

  stateAttributes = {
    ariaSelected: "aria-selected",
    tabIndex: "tabindex",
  };

  constructor(rootElement) {
    super();
    this.rootElement = rootElement;
    this.buttonElements = rootElement.querySelectorAll(this.selectors.button);
    this.contentElements = rootElement.querySelectorAll(this.selectors.content);
    this.state = this.getProxyState({
      activeTabIndex: [...this.buttonElements].findIndex((tabButton) =>
        tabButton.classList.contains(this.stateClasses.isActive),
      ),
    });
    this.maxTabIndex = this.buttonElements.length - 1;
    this.bindEvents();
  }

  updateUI() {
    const { activeTabIndex } = this.state;

    this.buttonElements.forEach((tabButton, index) => {
      const isActive = activeTabIndex === index;

      tabButton.classList.toggle(this.stateClasses.isActive, isActive);
      tabButton.setAttribute(
        this.stateAttributes.ariaSelected,
        isActive.toString(),
      );
      tabButton.setAttribute(
        this.stateAttributes.tabIndex,
        isActive ? "0" : "-1",
      );
    });

    this.contentElements.forEach((tabContent, index) => {
      const isActive = activeTabIndex === index;

      tabContent.classList.toggle(this.stateClasses.isActive, isActive);
    });
  }

  onTabButtonClick(activeButtonIndex) {
    this.state.activeTabIndex = activeButtonIndex;
  }

  activateTab(newTabIndex) {
    this.state.activeTabIndex = newTabIndex;
    this.buttonElements[newTabIndex].focus();
  }

  previousTab = () => {
    const newTabIndex =
      this.state.activeTabIndex === 0
        ? this.maxTabIndex
        : this.state.activeTabIndex - 1;

    this.activateTab(newTabIndex);
  };

  nextTab = () => {
    const newTabIndex =
      this.state.activeTabIndex === this.maxTabIndex
        ? 0
        : this.state.activeTabIndex + 1;

    this.activateTab(newTabIndex);
  };

  firstTab = () => {
    this.activateTab(0);
  };

  lastTab = () => {
    this.activateTab(this.maxTabIndex);
  };

  onKeyDown(event) {
    const { code, metaKey } = event;

    const action = {
      ArrowLeft: this.previousTab,
      ArrowRight: this.nextTab,
      Home: this.firstTab,
      End: this.lastTab,
    }[code];

    const isMacHomeKey = metaKey && code === "ArrowLeft";
    if (isMacHomeKey) {
      this.firstTab();
      return;
    }

    const isMacEndKey = metaKey && code === "ArrowRight";
    if (isMacEndKey) {
      this.lastTab();
      return;
    }

    if (action) {
      action();
    }
  }

  bindEvents() {
    this.buttonElements.forEach((tabButton, index) => {
      tabButton.addEventListener("click", () => this.onTabButtonClick(index));
    });
    this.rootElement.addEventListener("keydown", (event) =>
      this.onKeyDown(event),
    );
  }
}

class TabsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Tabs(element);
    });
  }
}

export default TabsCollection;
