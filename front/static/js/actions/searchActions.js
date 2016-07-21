import qs from 'querystring';

export const getResults = (searchTerms) => {
  let queryString = qs.stringify({qstr: searchTerms})
  let searchEndpoint = '/search?' + queryString
  return (dispatch) => {
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

export const sendResultClick = (qstr, timestamp, resultIDs, clickedID) => {
	let endpoint = '/feedback?'
	let body = JSON.stringify({ qstr, timestamp, resultIDs, clickedID })
	return (dispatch) => {
		console.log("sent feedback", body)
	// 	fetch(endpoint, {
	// 		method: 'POST',
	// 		body: body
	// 	})
	} 
}