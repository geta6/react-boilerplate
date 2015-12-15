import axios from 'axios';
import merge from 'lodash/object/merge';
import {canUseDOM} from 'fbjs/lib/ExecutionEnvironment';

const getUrl = (pathname) => encodeURI(/^\//.test(pathname) ? `${canUseDOM ? '' : process.env.ENDPOINT}${pathname}` : pathname);
const getOpt = (options) => merge({timeout: 5000, headers: {'Content-Type': 'application/vnd.api+json'}}, options);

export default (method, pathname, config = {}) => {
  return axios[method.toLowerCase()](getUrl(pathname), getOpt(config));
};
