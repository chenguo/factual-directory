import { connect } from 'react-redux'
import SearchResults from '../SearchResults'
import { sendResultClick } from '../../actions/searchActions'

const mapStateToProps = (state) => {
  console.log('container', state.searchReducer.results)
	return {
		searchResult: state.searchReducer.results
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    submitClick: (qstr, timestamp, clickedID, resultIDs) => dispatch(sendResultClick(qstr, timestamp, resultIDs, clickedID))
	}
}

const SearchResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResults)

export default SearchResultsContainer