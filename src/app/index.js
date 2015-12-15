import {PropTypes} from 'react';
import Fluxible from 'fluxible';
import {provideContext} from 'fluxible-addons-react';

export default new Fluxible({
  component: provideContext(require('./components/ApplicationComponent'), {insertCss: PropTypes.func.isRequired}),
  stores: [
    require('./stores/RouteStore'),
    require('./stores/ErrorStore'),
    require('./stores/TextStore'),
  ],
});
