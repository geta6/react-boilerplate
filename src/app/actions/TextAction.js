import get from 'lodash/object/get';
import isError from 'lodash/lang/isError';
import keyMirror from 'fbjs/lib/keyMirror';
import TextStore from '../stores/TextStore';
import request from '../utils/Request';

function TextAction(context, payload) {
  return new Promise(async (resolve, reject) => {
    try {
      resolve(await TextAction.actions[get(payload, ['type'])]({context, payload}));
    } catch (error) {
      reject(isError(error) ? reject(error) : new Error(`${error.status} ${error.statusText}`));
    }
  });
}

TextAction.actions = {
  async setText({context}) {
    const res = await request('get', '/api/text');
    context.dispatch(TextStore.dispatchTypes.SET_TEXT, {text: res.data});
  },
};

TextAction.displayName = TextAction.name;
TextAction.actionTypes = keyMirror(TextAction.actions);

export default TextAction;
