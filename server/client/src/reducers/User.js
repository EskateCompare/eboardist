const defaultState = {
  user: {
  	recommendations: [],
    impressions: [],
  }
};

export default (state = defaultState, action) => {
  switch(action.type) {
    case 'ADD_USER_RECOMMENDATION':
      let recommendationsArr = [];
      let filteredArray = state.user.recommendations;

      for(let recommendation of state.user.recommendations) {
        if (recommendation.product === action.payload.product) {
          filteredArray = state.user.recommendations.filter(item => item.product !== recommendation.product)
        }
      }

      recommendationsArr = [].concat(filteredArray, action.payload)

      return Object.assign({}, state, {
        user: {
          ...state.user,
        	recommendations: recommendationsArr
        }
    })
    case 'ADD_USER_IMPRESSION':
    let impressionsArray = state.user.impressions
    let productExists;

    let product = {
      name: '',
      impressions: []
    }

    let impression = {
      impressionId: '',
      change: '',
    }

    if (state.user.impressions.length > 0) {
      productExists = state.user.impressions.find((impression) => (impression.name === action.payload.product))       
    }

    product.name = action.payload.product
    impression.impressionId = action.payload.impressionId
    impression.change = action.payload.change

    if (productExists) {
      let impressionIdExists;
      if (productExists.impressions.length > 0) {
        impressionIdExists = productExists.impressions.find((impression) => (impression.impressionId === action.payload.impressionId))
        if (impressionIdExists) {
          const index = productExists.impressions.findIndex((impression) => (impression.impressionId === action.payload.impressionId))
          productExists.impressions[index] = impression
        } else {
          productExists.impressions.push(impression)
        }
      }
    } else {
      product.impressions.push(impression)
      impressionsArray.push(product)
    }

      return Object.assign({}, state, {
        user: {
          ...state.user,
          impressions: impressionsArray
        }
    })
    default:
      return state;
  }
}


      // product: [
      //   product: action.payload.prodcut
      //   impressions: 
      //     impressionId: impressionId
      //     change: change
      // ]