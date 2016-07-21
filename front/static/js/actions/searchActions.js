const getResults = (searchTerms, dataSource) => {
	console.log(searchTerms)
	let searchEndpoint = ''
	return (dispatch) => {
		fetch(searchEndpoint, {
      		method: 'POST',
      		body: JSON.stringify(searchTerms),
      		credentials: 'include'
    	})
		.then(response => { 
			if (response.status === 200) {
				return response.json();
			}
			else {
				if (browserSupportsLocalStorage()) {
					localStorage.clear();
				}
				console.log(response)
			}
		})
		.then(json => {
			dispatch({
				type: "RECEIVE_SEARCH_RESULTS",
				results: json
			})
		})	
	}
}

export default getResults