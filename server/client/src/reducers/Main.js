const defaultState = {
  searchResults: [],
  fetching: false,
  error: null,
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'REQUEST_TEXT_SEARCH':
      return Object.assign({}, state, {
        fetching: true
    })
    case 'FETCH_TEXT_SEARCH_ERROR':
      return Object.assign({}, state, {
        error: action.payload
    })
    case 'RECEIVE_TEXT_SEARCH':
      return Object.assign({}, state, {
        searchResults: action.payload,
        fetching: false
    })
    case 'UPDATE_FIELD':
      return Object.assign({}, state, {
        [action.key] : action.value
      })
    case 'PRODUCT_SELECTED_TEXT_SEARCH':
      return Object.assign({}, state, {
          redirectTo: action.payload,
          searchResults: null
    })
    case 'REDIRECT':
      return Object.assign({}, state, {
          redirectTo: null
    })
    case 'REQUEST_POST_FEEDBACK':
      return Object.assign({}, state, {
        // fetching: true
    })
    case 'FETCH_POST_FEEDBACK_ERROR':
      return Object.assign({}, state, {
        error: action.payload
    })
    case 'RECEIVE_POST_FEEDBACK':
      return Object.assign({}, state, {
        // fetching: false
    })
    default:
      return state;
  }
}
