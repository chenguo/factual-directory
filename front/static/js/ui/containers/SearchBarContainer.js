import { connect } from 'react-redux'
import SearchBar from '../SearchBar'
import { getResults } from '../../actions/searchActions'

const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		doSearch: (searchTerms, data) => dispatch(getResults(searchTerms, data))
	}
}

const SearchBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(SearchBar)

export default SearchBarContainer
