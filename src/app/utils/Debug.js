import debug from 'debug';

if (['development'].indexOf(process.env.NODE_ENV) > -1) {
  debug.enable('app:*');
}

export default (label, forceEnable) => {
  forceEnable && debug.enable('app:*');
  return debug(`app:${label}`);
};
