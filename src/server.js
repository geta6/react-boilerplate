import 'babel-core/polyfill';
import path from 'path';
import koa from 'koa';
import mount from 'koa-mount';
import serialize from 'serialize-javascript';
import React from 'react';
import ReactDOM from 'react-dom/server';
import {navigateAction} from 'fluxible-router';
import ErrorAction from './app/actions/ErrorAction';
import HtmlRootComponent from './app/components/HtmlRootComponent';
import Payload from './app/utils/Payload';
import app from './app';

const srv = koa();

srv.use(require('koa-response-time')());
srv.use(require('koa-logger')());
srv.use(require('koa-helmet')());
srv.use(require('koa-conditional-get')());
srv.use(require('koa-etag')());
srv.use(require('koa-favicon')(path.join(__dirname, 'public/favicon.ico')));
srv.use(require('koa-static')(path.join(__dirname, 'public')));
srv.use(require('koa-bodyparser')());

srv.use(mount('/api/text', require('./middlewares/TextMiddleware')));

srv.use(function* render() {
  try {
    this.context = app.createContext();
    yield this.context.executeAction(navigateAction, {
      url: this.url,
      config: {headers: {Cookie: this.headers.cookie}},
    });
  } catch (reason) {
    const statusCode = reason.status || reason.statusCode || 500;
    yield this.context.executeAction(ErrorAction, new Payload({
      type: ErrorAction.actionTypes.setError,
      entity: {error: {statusCode, message: reason.message}},
    }));
    statusCode >= 500 && process.stderr.write(reason.stack);
  } finally {
    const styles = [];
    const Component = this.context.getComponent();
    const componentContext = Object.assign(this.context.getComponentContext(), {insertCss: css => styles.push(css._getCss())});
    const markup = ReactDOM.renderToString(<Component context={componentContext} />);

    this.status = this.context.getStore('ErrorStore').getCurrentError('statusCode');
    this.body = '<!DOCTYPE html>' + ReactDOM.renderToStaticMarkup(<HtmlRootComponent
      state={`window.dehydrated=${serialize(app.dehydrate(this.context))}`}
      styles={styles.join('')}
      markup={markup}
      context={this.context.getComponentContext()} />
    );
  }
});

if (process.env.NODE_ENV !== 'test') {
  const server = srv.listen(process.env.PORT, () => {
    server.timeout = ~~process.env.TIMEOUT;
    const {address, port} = server.address();
    process.stdout.write(`The server is running at http://${address}:${port}\n`);
    return typeof process.send === 'function' && process.send('online');
  });

  process.on('message', async msg => msg === 'shutdown' && process.exit(0));
}

export default srv;
