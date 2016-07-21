const getResults = (searchTerms, dataSource) => {
	let searchEndpoint = '/search?qstr=hello'
	return (dispatch) => {
		console.log(searchTerms)
		fetch(searchEndpoint, {
      		method: 'GET'
    	})
		.then(response => { 
			console.log(response)
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