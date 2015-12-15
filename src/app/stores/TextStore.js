import {fromJS} from 'immutable';
import keyMirror from 'fbjs/lib/keyMirror';
import {createStore} from 'fluxible/addons';

const TextStore = createStore({
  storeName: 'TextStore',

  handlers: {
    SET_TEXT: 'setCurrentText',
  },

  defaults: {
    currentText: fromJS({}),
  },

  initialize() {
    this.currentText = this.defaults.currentText;
  },

  setCurrentText({text}) {
    const currentText = this.currentText.merge(fromJS(text));
    if (!this.currentText.equals(currentText)) {
      this.currentText = currentText;
      this.emitChange();
    }
  },

  getCurrentText() {
    return this.currentText ? this.currentText.toJS() : {};
  },

  dehydrate() {
    return {
      text: this.currentText.toJS(),
    };
  },

  rehydrate({text}) {
    this.currentText = fromJS(text);
  },
});

export default Object.assign(TextStore, {dispatchTypes: keyMirror(TextStore.handlers)});
