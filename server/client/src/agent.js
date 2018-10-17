import superagentPromise from 'superagent-promise';
import _superagent from 'superagent';
var config = require('./config');


const superagent = superagentPromise(_superagent, global.Promise);



var API_ROOT_RAW = config.api_root;
const API_ROOT = API_ROOT_RAW.replace('/undefined', '');

const _api_root = {
  root: API_ROOT
}

const responseBody = res => res.body;


const requests = {
  get: url =>
    superagent.get(`${API_ROOT}${url}`).then(responseBody),
  post: (url, body) =>
    superagent.post(`${API_ROOT}${url}`, body).then(responseBody),
  put: (url, body) =>
    superagent.put(`${API_ROOT}${url}`, body).then(responseBody),
  del: (url) =>
    superagent.del(`${API_ROOT}${url}`).then(responseBody)
};

const Eboards = {
  single: function(slug) {
    return requests.get('/api/eboards/'+slug);
  }
};


export default {
  Eboards,
  _api_root
};
