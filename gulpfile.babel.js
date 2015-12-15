import cp from 'child_process';
import path from 'path';
import gulp from 'gulp';
import util from 'gulp-util';
import del from 'del';
import run from 'run-sequence';
import replace from 'replace';
import webpack from 'webpack';
import defaults from 'lodash/object/defaults';
import browserSync from 'browser-sync';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import {copy, watch} from './src/utils/FileSystem';

const DEBUG = !process.argv.includes('--release');
const WATCH = process.argv.includes('--watch');

defaults(process.env, {
  ADDRESS: '0.0.0.0',
  NODE_ENV: DEBUG ? 'development' : 'production',
  PORT: 3000,
});

switch (process.env.NODE_ENV) {
  case 'production':
    defaults(process.env, {ENDPOINT: `http://localhost:${process.env.PORT}`});
    break;
  default:
    defaults(process.env, {ENDPOINT: `http://localhost:${process.env.PORT}`});
    break;
}

/**
 * Compiles the project from source files into a distributable format and copies it to the output (build) folder.
 */
gulp.task('build', async () => {
  await new Promise(resolve => run('clean', 'copy', 'bundle', resolve));
});

/**
 * Cleans up the output (build) directory.
 */
gulp.task('clean', async () => {
  await del(['build/*'], {dot: true});
});

/**
 * Copies static files such as robots.txt, favicon.ico to the output (build) folder.
 */
gulp.task('copy', async () => {
  await Promise.all([
    copy('src/public', 'build/public'),
    copy('package.json', 'build/package.json'),
  ]);

  replace({
    regex: '"start".*',
    replacement: '"start": "pm2 startOrRestart package.json"',
    paths: ['build/package.json'],
    recursive: false,
    silent: true,
  });

  if (WATCH) {
    const watcher = await watch('src/public/**/*');
    watcher.on('changed', async file => {
      util.log('[changed]', file);
      const rel = file.substr(path.join(__dirname, '../src/public/').length);
      await copy(`src/public/${rel}`, `build/public/${rel}`);
    });
  }
});

/**
 * Bundles JavaScript into one or more packages ready to be used in a browser.
 */
gulp.task('bundle', async () => {
  const config = require('./webpack.config.babel');

  await new Promise((resolve, reject) => {
    let count = 0;
    const bundler = webpack(config);
    const bundle = (err, stats) => {
      if (err) {
        reject(new util.PluginError('bundle', err.message));
      } else {
        util.log(stats.toString(config[0].stats));
        if (++count === (WATCH ? config.length : 1)) {
          resolve();
        }
      }
    };

    if (WATCH) {
      bundler.watch(200, bundle);
    } else {
      bundler.run(bundle);
    }
  });
});

/**
 * Launches Node.js/Express web server in a separate (forked) process.
 */
gulp.task('serve', async () => {
  await new Promise((resolve, reject) => {
    const start = () => {
      const server = cp.fork(path.join(__dirname, 'build/server.js'), {
        env: Object.assign({NODE_ENV: 'development'}, process.env),
        silent: false,
      });
      server.once('message', message => /online/.test(message) && resolve());
      server.once('error', err => reject(err));
      return server;
    };

    let server = start();

    process.on('exit', () => server.kill('SIGTERM'));

    if (WATCH) {
      watch('build/server.js').then(watcher => {
        watcher.on('changed', () => {
          server.kill('SIGTERM');
          server = start();
        });
      });
    }
  });
});

/**
 * Launches a development web server with "live reload" functionality synchronizing URLs, interactions and code changes across multiple devices.
 */
gulp.task('start', async () => {
  const config = require('./webpack.config.babel')[0];
  const bundler = webpack(config);

  await new Promise(resolve => run('build', 'serve', resolve));

  browserSync.init({
    ui: false,
    notify: false,
    ghostMode: false,

    proxy: {
      target: process.env.ENDPOINT,
      middleware: [
        webpackDevMiddleware(bundler, {publicPath: config.output.publicPath, stats: config.stats}),
        webpackHotMiddleware(bundler),
      ],
    },

    files: [
      'build/public/**/*.css',
      'build/public/**/*.html',
    ],
  });
});
