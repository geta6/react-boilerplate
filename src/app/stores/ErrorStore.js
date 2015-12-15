import Immutable from 'immutable';
import keyMirror from 'fbjs/lib/keyMirror';
import {createStore} from 'fluxible/addons';

const ErrorStore = createStore({
  storeName: 'ErrorStore',

  handlers: {
    SET_ERROR: 'setCurrentError',
  },

  defaults: {
    currentError: Immutable.fromJS({statusCode: 200, message: null}),
  },

  initialize() {
    this.currentError = this.defaults.currentError;
  },

  setCurrentError({error}) {
    const currentError = this.defaults.currentError.merge(Immutable.fromJS(error));
    if (!Immutable.is(this.currentError, currentError)) {
      this.currentError = currentError;
      this.emitChange();
    }
  },

  getCurrentError(...param) {
    const currentError = param.length > 0 ? this.currentError.getIn(param) : this.currentError;
    return currentError && currentError.toJS ? currentError.toJS() : currentError;
  },

  dehydrate() {
    return {
      error: this.getCurrentError(),
    };
  },

  rehydrate({error}) {
    this.currentError = Immutable.fromJS(error);
  },
});

export default Object.assign(ErrorStore, {dispatchTypes: keyMirror(ErrorStore.handlers)});
