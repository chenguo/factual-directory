import React from 'react'
import ResultRow from './ResultRow'

let styles = {
  wrapper: {
    height: '60vw',
    overflow: 'scroll'
  }
}

const SearchResults = (props) => {
  console.log(props.results)
  if (props.results.length == 0) {
    return null
  } else {
    let resultIDs = props.results.map( (result) => result.id )
    let qstr = props.query
    let timestamp = props.timestamp
    return (
      <div style={styles.wrapper} className={'result-links'}>
        {props.results.map( (result, i) => 
          <ResultRow {...result} 
                      key={i}
                      submitClick={ (clickedID) => props.submitClick(qstr, timestamp, clickedID, resultIDs)} /> 
        )}
      </div>
    )
  }
}

export default SearchResults