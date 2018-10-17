import fetch from 'cross-fetch'
const queryString = require('query-string');

export function requestFilter() {
  return {
    type: 'REQUEST_FILTER',
  }
}

export function receiveFilter(payload) {
  return {
    type: 'RECEIVE_FILTER',
    payload
  }
}

export function fetchFilterError(payload) {
  return {
    type: 'FETCH_FILTER_ERROR',
    payload
  }
}

export function fetchFilter(payload) {
  const urlParams = (payload) ? serialize(payload) : '';
  return dispatch => {
    dispatch(requestFilter())
    return fetch(`/api/filter-options?${urlParams}`)
      .then(response => response.json())
      .then(json => dispatch(receiveFilter(json)))
      .catch(err => dispatch(fetchFilterError(err)))
  }
}

export function requestProducts() {
  return {
    type: 'REQUEST_PRODUCTS',
  }
}

export function receiveProducts(payload) {
  return {
    type: 'RECEIVE_PRODUCTS',
    payload
  }
}

export function fetchProductsError(payload) {
  return {
    type: 'FETCH_PRODUCTS_ERROR',
    payload
  }
}

export function fetchProducts(payload) {
  const urlParams = (payload) ? serialize(payload) : '';
  return dispatch => {
    dispatch(requestProducts())
    return fetch(`/api/products?${urlParams}`)
      .then(response => response.json())
      .then(json => dispatch(receiveProducts(json)))
      .catch(err => dispatch(fetchProductsError(err)))
  }
}

export function incrementPage() {
  return {
    type: 'INCREMENT_PAGE'
  }
}

function serialize(payload) {
  let obj = {
    perPage: 10,
    page: 1,
    sortDir: 'dsc',
    sortBy: 'rating'
  }

  let merged = {...obj, ...payload}

  let str = [];
  for (let p in merged)
    if (merged.hasOwnProperty(p)) {
      if(!merged[p].length == 0 || merged[p] > 0) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(merged[p]));
      }
    }

  let serialized = str.join("&");

  return serialized;
}

export function onFilterChange(payload) {
  return {
    type: 'ON_FILTER_CHANGE',
    payload
  }
}

export function onClearFilter() {
  return {
    type: 'ON_CLEAR_FILTER',
  }
}

export function onSortDirection(payload) {
  return {
    type: 'ON_SORT_DIRECTION',
    payload
  }
}

export function onSortBy(payload) {
  return {
    type: 'ON_SORT_BY',
    payload
  }
}


