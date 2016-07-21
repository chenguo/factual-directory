import { connect } from 'react-redux'
import SearchResults from '../SearchResults'

const mapStateToProps = (state) => {
	return {
		results: state.searchReducer.results
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
	}
}

const SearchResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResults)

export default SearchResultsContainer