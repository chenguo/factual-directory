import React from 'react'
import { connect } from 'react-redux'
import LinearProgress from 'material-ui/LinearProgress';


const ProgressBar = (props) => {
  console.log(props.loading)
  return (
    props.loading ? <LinearProgress mode="indeterminate" style={{width: '95%', margin: 'auto'}} /> : null
  )
}
const mapStateToProps = (state) => {
  return {
    loading: state.searchReducer.loading
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

const ProgressBarContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ProgressBar)

export default ProgressBarContainer