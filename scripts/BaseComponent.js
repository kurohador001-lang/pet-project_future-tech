class BaseComponent {
  constructor() {
    if (constructor === BaseComponent) {
      throw new Error("Нельзя вызвать абстрактный класс BaseComponent!");
    }
  }

  getProxyState(initialState) {
    return new Proxy(initialState, {
      get: (target, prop) => {
        return target[prop];
      },

      set: (target, prop, newValue) => {
        const oldValue = target[prop];

        target[prop] = newValue;

        if (newValue !== oldValue) {
          this.updateUI();
        }

        return true;
      },
    });
  }

  updateUI() {
    throw new Error("Отсутствует необходимый метод updateUI!");
  }
}

export default BaseComponent;
