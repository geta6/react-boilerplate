import 'babel-core/polyfill';
import React from 'react';
import ReactDOM from 'react-dom';
import fastclick from 'fastclick';
import app from './app';

app.rehydrate(window.dehydrated, (err, context) => {
  if (err) {
    throw err;
  } else {
    fastclick.attach(document.body);
    const Component = context.getComponent();
    const componentContext = Object.assign(context.getComponentContext(), {insertCss: css => css._insertCss()});
    ReactDOM.render(<Component context={componentContext} />, document.getElementById('app'));
  }
});
