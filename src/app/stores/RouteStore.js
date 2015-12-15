import {RouteStore} from 'fluxible-router';
import TextAction from '../actions/TextAction';
import Payload from '../utils/Payload';

const createConfig = (context, config = {}) => {
  Object.assign({}, config, context.getStore('RouteStore').getCurrentNavigate().config);
};

export default RouteStore.withStaticRoutes({
  index: {
    path: '/',
    method: 'get',
    handler: require('../components/IndexComponent'),
    async action(context) {
      await context.executeAction(TextAction, new Payload({
        type: TextAction.actionTypes.setText,
        config: createConfig(context),
      }));
    },
  },
});
