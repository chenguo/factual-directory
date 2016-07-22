let initialState = {
  results: {
    results: [],
    timestamp: 0,
    query: ''
  }, 
  loading: false
}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_SEARCH_RESULTS":
      return {
        results: action.results,
        loading: false
      }
    case "GET_SEARCH_RESULTS":
      return Object.assign({}, state, {loading: true})
    default:
      return state
  }
}

export default searchReducer