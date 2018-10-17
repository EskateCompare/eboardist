const defaultState = {
  products: {
    products: []
  },
  filter: {
    stats: {
      filterOptions: []
    }
  },
  filterState: {
    perPage: 10,
    page: 1,
    brands: [],
    year: [],
    price: [],
    range: [],
    sortBy: 'rating',
    sortDir: 'dsc',
    style: [],
    terrain: [],
    drive: [],
    speed: [],
    deckMaterials: [],
    features: [],
    weight: [],
    maxWeight: [],
    width: [],
    length: [],
    wheelDiameter: [],
    hillGrade: [],
    speedModes: [],
    batteryPower: [],
    batteryWattHours: [],
    chargeTime: [],
    manufacturerWarranty: [],
    rating: [],
  },
  fetching: false,
  error: null,
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'REQUEST_PRODUCTS':
      return Object.assign({}, state, {
        fetching: true
    })
    case 'FETCH_PRODUCTS_ERROR':
      return Object.assign({}, state, {
        error: action.payload
    })
    case 'RECEIVE_PRODUCTS':
      if (state.filterState.page > 1) {
        const appendedArray = state.products.products.concat(action.payload.products)
        return Object.assign({}, state, {
          products: {
            products: appendedArray,
          },
          fetching: false
        })
      }
      return Object.assign({}, state, {
        products: action.payload,
        fetching: false
    })
    case 'REQUEST_MORE_PRODUCTS':
      return Object.assign({}, state, {
        fetching: true
    })
    case 'FETCH_MORE_PRODUCTS_ERROR':
      return Object.assign({}, state, {
        error: action.payload
    })
    case 'RECEIVE_MORE_PRODUCTS':
      const appendedArray = state.products.products.concat(action.payload.products)
      return Object.assign({}, state, {
        products: {
          products: appendedArray,
        },
        fetching: false
    })
    case 'REQUEST_FILTER':
      return Object.assign({}, state, {
        fetching: true
    })
    case 'FETCH_FILTER_ERROR':
      return Object.assign({}, state, {
        error: action.payload
    })
    case 'RECEIVE_FILTER':
      return Object.assign({}, state, {
        filter: action.payload,
        fetching: false
    })
    case 'ON_FILTER_CHANGE':
      const { payload } = action;
      const { checked } = payload;
      const key = Object.keys(action.payload)[0];
      const arr = state.filterState[key];
      const finalArr = checked ? arr.concat(action.payload[key]) : arr.filter(val => val !== action.payload[key]);
      state.filterState[key] = finalArr;
      state.filterState['page'] = 1;

      return Object.assign({}, state, {
        filterState: state.filterState
    })
    case 'ON_SORT_DIRECTION':
      const sortDir = Object.assign({}, state.filterState, action.payload)

      return Object.assign({}, state, {
        filterState: sortDir
    })

    case 'ON_SORT_BY':
      const sortBy = Object.assign({}, state.filterState, action.payload)

      return Object.assign({}, state, {
        filterState: sortBy
    })
    case 'INCREMENT_PAGE':
      return Object.assign({}, state, {
        filterState: {
          ...state.filterState,
          page: ++state.filterState.page
        }
    })
    case 'ON_CLEAR_FILTER':
      return Object.assign({}, state, {
        filterState: {
          perPage: 10,
          page: 1,
          brands: [],
          year: [],
          price: [],
          range: [],
          sortBy: 'rating',
          sortDir: 'dsc',
          style: [],
          terrain: [],
          drive: [],
          speed: [],
          deckMaterials: [],
          features: [],
          weight: [],
          maxWeight: [],
          width: [],
          length: [],
          wheelDiameter: [],
          hillGrade: [],
          speedModes: [],
          batteryPower: [],
          batteryWattHours: [],
          chargeTime: [],
          manufacturerWarranty: [],
          rating: [],
        }
    })
    default:
      return state;
  }
}
