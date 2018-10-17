import fetch from 'cross-fetch'

export function requestTextSearch() {
  return {
    type: 'REQUEST_TEXT_SEARCH',
  }
}

export function receiveTextSearch(payload) {
  return {
    type: 'RECEIVE_TEXT_SEARCH',
    payload
  }
}

export function fetchTextSearchError(payload) {
  return {
    type: 'FETCH_TEXT_SEARCH_ERROR',
    payload
  }
}

export function fetchTextSearch(payload) {
  return dispatch => {
    dispatch(requestTextSearch())
    return fetch(`/api/text-search?searchString=${payload}`)
      .then(response => response.json())
      .then(json => dispatch(receiveTextSearch(json)))
      .catch(err => dispatch(fetchTextSearchError(err)))
  }
}

export function requestPostFeedback() {
  return {
    type: 'REQUEST_POST_FEEDBACK',
  }
}

export function receivePostFeedback(payload) {
  return {
    type: 'RECEIVE_POST_FEEDBACK',
    payload
  }
}

export function fetchPostFeedbackError(payload) {
  return {
    type: 'FETCH_POST_FEEDBACK_ERROR',
    payload
  }
}

export function fetchPostFeedback(payload) {
  return dispatch => {
    dispatch(requestPostFeedback())
    return fetch('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(payload),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(json => dispatch(receivePostFeedback(json)))
    .catch(err => dispatch(fetchPostFeedbackError(err)))
  }
}

export function redirectToSelectedProduct(payload) {
  return {
    type: 'PRODUCT_SELECTED_TEXT_SEARCH',
    payload
  }
}

export function resetRedirect() {
  return {
    type: 'REDIRECT'
  }
}
export function updateField(key, value) {
  return {
    type: 'UPDATE_FIELD',
    key,
    value
  }
}
