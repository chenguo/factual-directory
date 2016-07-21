import { connect } from 'react-redux'
import NavBar from '../NavBar'

const mapStateToProps = (state) => {
	return {
	}
}

const mapDispatchToProps = (dispatch) => {
	return {
		toggleDrawer: () => dispatch({type: "TOGGLE_DRAWER"})
	}
}

const NavBarContainer = connect(
	mapStateToProps,
	mapDispatchToProps
)(NavBar)

export default NavBarContainer