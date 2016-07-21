let initialState = {results: [], init: true}

const searchReducer = (state = initialState, action) => {
  switch (action.type) {
    case "RECEIVE_SEARCH_RESULTS":
      console.log(action.results)
      return {
        results: action.results.results,
        init: false
      }
    default:
      return state
  }
}

export default searchReducer