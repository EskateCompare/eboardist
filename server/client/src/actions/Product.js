import fetch from 'cross-fetch'
// import { constants: SET_FILTER, SET_PRODUCTS } from '../constants';

export function requestProduct() {
  return {
    type: 'REQUEST_PRODUCT',
  }
}

export function receiveProduct(payload) {
  return {
    type: 'RECEIVE_PRODUCT',
    payload
  }
}

export function fetchProductError(payload) {
  return {
    type: 'FETCH_PRODUCT_ERROR',
    payload
  }
}

export function fetchProduct(payload) {
  return dispatch => {
    dispatch(requestProduct())
    return fetch(`/api/products/${payload}`)
      .then(response => response.json())
      .then(json => dispatch(receiveProduct(json)))
      .catch(err => dispatch(fetchProductError(err)))
  }
}

export function requestPostRecommend() {
  return {
    type: 'REQUEST_POST_RECOMMEND',
  }
}

export function receivePostRecommend(payload) {
  return {
    type: 'RECEIVE_POST_RECOMMEND',
    payload
  }
}

export function fetchPostRecommendError(payload) {
  return {
    type: 'FETCH_POST_RECOMMEND_ERROR',
    payload
  }
}

export function fetchPostRecommend(payload) {
  return dispatch => {
    dispatch(requestPostRecommend())
    return fetch('/api/recommend', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(receivePostRecommend(json)))
    .catch(err => dispatch(fetchPostRecommendError(err)))
  }
}

export function requestImpressions() {
  return {
    type: 'REQUEST_IMPRESSIONS',
  }
}

export function receiveImpressions(payload) {
  return {
    type: 'RECEIVE_IMPRESSIONS',
    payload
  }
}

export function fetchImpressionsError(payload) {
  return {
    type: 'FETCH_IMPRESSIONS_ERROR',
    payload
  }
}

export function fetchImpressions() {
  return dispatch => {
    dispatch(requestImpressions())
    return fetch(`/api/impressions/`)
      .then(response => response.json())
      .then(json => dispatch(receiveImpressions(json)))
      .catch(err => dispatch(fetchImpressionsError(err)))
  }
}

export function requestPostImpressions() {
  return {
    type: 'REQUEST_POST_IMPRESSIONS',
  }
}

export function receivePostImpressions(payload) {
  return {
    type: 'RECEIVE_POST_IMPRESSIONS',
    payload
  }
}

export function fetchPostImpressionsError(payload) {
  return {
    type: 'FETCH_POST_IMPRESSIONS_ERROR',
    payload
  }
}

export function fetchPostImpressions(payload) {
  return dispatch => {
    dispatch(requestPostImpressions())
    return fetch('/api/impressions/', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(receivePostImpressions(json)))
    .catch(err => dispatch(fetchPostImpressionsError(err)))
  }
}