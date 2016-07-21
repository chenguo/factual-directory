import qs from 'querystring';

const getResults = (searchTerms, dataSource) => {
  let queryString = qs.stringify({qstr: searchTerms})
  let searchEndpoint = '/search?' + queryString
  return (dispatch) => {
    fetch(searchEndpoint, {
      method: 'GET'
    }).then(response => {
      if (response.status === 200) {
        return response.json();
      } else {
        if (browserSupportsLocalStorage()) {
          localStorage.clear();
        }
      }
    }).then(json => {
      dispatch({
        type: "RECEIVE_SEARCH_RESULTS",
        results: json
      })
    })
  }
}

export default getResults
