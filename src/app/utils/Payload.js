import size from 'lodash/collection/size';
import omit from 'lodash/object/omit';

class Payload {
  constructor(payload) {
    if (size(omit(payload, ['type', 'entity', 'config'])) > 0) {
      throw new Error('Payload should declared by keys of `type`, `entity` or `config`.');
    } else {
      return Object.assign({}, {type: '', entity: {}, config: {}}, payload);
    }
  }
}

export default Payload;
