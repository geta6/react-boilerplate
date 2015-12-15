import fs from 'fs';
import ncp from 'ncp';
import gaze from 'gaze';
import _mkdirp from 'mkdirp';

export function copy(source, destination) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, err => err ? reject(err) : resolve());
  });
}

export function watch(pattern) {
  return new Promise((resolve, reject) => {
    gaze(pattern, (err, watcher) => err ? reject(err) : resolve(watcher));
  });
}

export function exists(file) {
  return new Promise(resolve => {
    fs.access(file, err => err ? resolve(false) : resolve(true));
  });
}

export function write(file, data) {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, err => err ? reject(err) : resolve());
  });
}

export function read(file, encoding) {
  return new Promise((resolve, reject) => {
    fs.readFile(file, encoding, (err, data) => err ? reject(err) : resolve(data));
  });
}

export function readdir(dir) {
  return new Promise((resolve, reject) => {
    fs.readdir(dir, (err, files) => err ? reject(err) : resolve(files));
  });
}

export function unlink(file) {
  return new Promise((resolve, reject) => {
    fs.unlink(file, err => err ? reject(err) : resolve());
  });
}

export function mkdirp(...args) {
  return _mkdirp(...args);
}
