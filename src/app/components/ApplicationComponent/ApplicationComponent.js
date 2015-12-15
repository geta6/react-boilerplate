import React, {PropTypes} from 'react';
import {handleHistory} from 'fluxible-router';
import {connectToStores} from 'fluxible-addons-react';
import ErrorComponent from '../ErrorComponent';
import style from './ApplicationComponent.styl';

const ApplicationComponent = React.createClass({
  displayName: 'ApplicationComponent',

  propTypes: {
    context: PropTypes.object.isRequired,
    currentRoute: PropTypes.object,
    currentError: PropTypes.object,
  },

  contextTypes: {
    insertCss: PropTypes.func.isRequired,
  },

  componentWillMount() {
    this.removeCss = this.context.insertCss(style);
  },

  componentWillUnmount() {
    this.removeCss();
  },

  render() {
    return (
      <div id='ApplicationComponent'>
        {(() => {
          if (this.props.currentRoute && this.props.currentError.statusCode < 400) {
            const RouteHandler = this.props.currentRoute.handler;
            return <RouteHandler context={this.props.context} />;
          } else {
            return <ErrorComponent context={this.props.context} />;
          }
        })()}
      </div>
    );
  },
});

export default handleHistory(connectToStores(ApplicationComponent, ['RouteStore', 'ErrorStore'], context => {
  return {
    currentRoute: context.getStore('RouteStore').getCurrentRoute(),
    currentError: context.getStore('ErrorStore').getCurrentError(),
  };
}));
