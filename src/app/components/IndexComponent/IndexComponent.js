import React, {PropTypes} from 'react';
import {connectToStores} from 'fluxible-addons-react';
import style from './IndexComponent.styl';

let IndexComponent = React.createClass({
  displayName: 'IndexComponent',

  propTypes: {
    currentText: PropTypes.object.isRequired,
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
      <div id='IndexComponent'>
        <div className='container'>
          <h1>{this.props.currentText.title}</h1>
          <article>{this.props.currentText.body}</article>
        </div>
      </div>
    );
  },
});

IndexComponent = connectToStores(IndexComponent, ['TextStore'], (context) => {
  return {
    currentText: context.getStore('TextStore').getCurrentText(),
  };
});

export default IndexComponent;
