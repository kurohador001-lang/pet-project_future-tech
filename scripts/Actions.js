const rootSelector = "[data-js-actions]";

class Actions {
  selectors = {
    rootSelector: rootSelector,
    likeButton: "[data-js-actions-like-button]",
  };

  stateAttributes = {
    title: "title",
    ariaLabel: "aria-label",
  };

  stateClasses = {
    isActive: "is-active",
  };

  constructor(rootElement) {
    this.rootElement = rootElement;
    this.likeButtonElement = rootElement.querySelector(
      this.selectors.likeButton,
    );

    if (!this.likeButtonElement) {
      return;
    }

    this.bindEvents();
  }

  onlikeButtonClick = () => {
    const isActive = this.likeButtonElement.classList.toggle("is-active");

    this.likeButtonElement.setAttribute(
      this.stateAttributes.title,
      isActive ? "Dislike" : "Like",
    );
    this.likeButtonElement.setAttribute(
      this.stateAttributes.ariaLabel,
      isActive ? "Dislike" : "Like",
    );
  };

  bindEvents() {
    this.likeButtonElement.addEventListener("click", this.onlikeButtonClick);
  }
}

class ActionsCollection {
  constructor() {
    this.init();
  }

  init() {
    document.querySelectorAll(rootSelector).forEach((element) => {
      new Actions(element);
    });
  }
}

export default ActionsCollection;
