import { connect } from 'react-redux'
import ResourceDrawer from '../ResourceDrawer'

const mapStateToProps = (state) => {
	return {
		open: state.drawerReducer.open
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		toggleDrawer: () => dispatch({type: "TOGGLE_DRAWER"})
	}
}

const ResourceDrawerContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(ResourceDrawer)

export default ResourceDrawerContainer