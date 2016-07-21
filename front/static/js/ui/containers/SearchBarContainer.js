import { connect } from 'react-redux'
import Searchbar from '../Searchbar'
import getResults from '../../actions/searchActions'

const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		doSearch: (searchTerms, data) => dispatch(getResults(searchTerms, data))
	}
}

const SearchbarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(Searchbar)

export default SearchbarContainer