export function addUserRecommendation(payload) {
  return {
    type: 'ADD_USER_RECOMMENDATION',
    payload
  }
}

export function addUserImpression(payload) {
  return {
    type: 'ADD_USER_IMPRESSION',
    payload
  }
}