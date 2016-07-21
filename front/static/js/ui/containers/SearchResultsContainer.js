import { connect } from 'react-redux'
import SearchResults from '../SearchResults'
import { sendResultClick } from '../../actions/searchActions'

const mapStateToProps = (state) => {
	return {
		results: state.searchReducer.results
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
    submitClick: (qstr, timestamp, clickedID, resultIDs) => dispatch(sendResultClick(qstr, timestamp, clickedID, resultIDs))
	}
}

const SearchResultsContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchResults)

export default SearchResultsContainer