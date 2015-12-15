import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import style from './ErrorComponent.styl';

const ErrorComponent = React.createClass({
  displayName: 'ErrorComponent',

  propTypes: {
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
      <div id='ErrorComponent'>
        <div id='ErrorComponentStatusCode'>{this.props.currentError.statusCode}</div>
        <div id='ErrorComponentMessage'>{this.props.currentError.message}</div>
      </div>
    );
  },
});

export default connectToStores(ErrorComponent, ['ErrorStore'], context => {
  return {
    currentError: context.getStore('ErrorStore').getCurrentError(),
  };
});
