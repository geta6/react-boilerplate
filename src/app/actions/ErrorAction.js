import get from 'lodash/object/get';
import isError from 'lodash/lang/isError';
import keyMirror from 'fbjs/lib/keyMirror';
import ErrorStore from '../stores/ErrorStore';

function ErrorAction(context, payload) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await ErrorAction.actions[get(payload, ['type'])]({context, payload}));
    } catch (error) {
      reject(isError(error) ? reject(error) : new Error(`${error.status} ${error.statusText}`));
    }
  });
}

ErrorAction.actions = {
  async setError({context, payload}) {
    const error = get(payload, ['entity', 'error']);
    context.dispatch(ErrorStore.dispatchTypes.SET_ERROR, {error});
  },

  async clearError({context}) {
    context.dispatch(ErrorStore.dispatchTypes.SET_ERROR, {error: {}});
  },
};

ErrorAction.displayName = ErrorAction.name;
ErrorAction.actionTypes = keyMirror(ErrorAction.actions);

export default ErrorAction;
