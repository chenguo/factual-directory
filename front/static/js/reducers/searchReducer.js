let initialState = {results: [], init: true}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_SEARCH_RESULTS":
      return {
        results: action.results,
        init: false
      }
    default:
      return state
  }
}

export default searchReducer