import React from 'react'
import ResultRow from './ResultRow'

let styles = {
  wrapper: {
    height: '100%',
    overflow: 'scroll',
    maxHeight: '81vh'
  }
}

const SearchResults = (props) => {
  if (props.searchResult.results.length == 0) {
    return null
  } else {
    let resultIDs = props.searchResult.results.map( (result) => result.id )
    let qstr = props.searchResult.query
    let timestamp = props.searchResult.timestamp
    console.log(props.searchResult)
    return (
      <div style={styles.wrapper} className={'result-links'}>
        {props.searchResult.results.map( (result, i) => 
          <ResultRow {...result} 
                      key={i}
                      submitClick={ (clickedID) => props.submitClick(qstr, timestamp, clickedID, resultIDs)} /> 
        )}
      </div>
    )
  }
}

export default SearchResults