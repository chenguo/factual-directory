import qs from 'querystring';

export const getResults = (searchTerms) => {
  let queryString = qs.stringify({qstr: searchTerms})
  let searchEndpoint = '/search?' + queryString
  return (dispatch) => {
    dispatch({
      type: "GET_SEARCH_RESULTS"
    })
    fetch(searchEndpoint, {
      method: 'GET'
    }).then(response => {
    	console.log(response)
      if (response.status === 200) {
        return response.json();
      } else {
        if (browserSupportsLocalStorage()) {
          localStorage.clear();
        }
      }
    }).then(json => {
    	console.log(json)
      dispatch({
        type: "RECEIVE_SEARCH_RESULTS",
        results: json
      })
    })
  }
}

export const sendResultClick = (query, timestamp, ids, selected) => {
	let endpoint = '/feedback'
  let headers = new Headers({
    'Content-Type': 'application/json'
  })
  console.log(query, timestamp)
	let body = JSON.stringify({ query, timestamp, ids, selected })
	return (dispatch) => {
		fetch(endpoint, {
			method: 'POST',
      headers: headers, 
			body: body
		})
	} 
}