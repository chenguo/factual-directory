import React from 'react'
import { connect } from 'react-redux'
import LinearProgress from 'material-ui/LinearProgress';


const ProgressBar = (props) => {
  console.log(props.loading)
  return (
    <LinearProgress mode={props.loading? "indeterminate" : "determinate"} style={{width: '80%', margin: 'auto'}} />
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