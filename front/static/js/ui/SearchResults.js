import React from 'react'
import ResultRow from './ResultRow'

let styles = {
  wrapper: {
    height: '60vw',
    overflow: 'scroll'
  }
}

const SearchResults = (props) => {
  if (props.results.length == 0) {
    return null
  } else {
    return (
      <div style={styles.wrapper} className={'result-links'}>
        {props.results.map( (result, i) => <ResultRow {...result} key={i}/> )}
      </div>
    )
  }
}

export default SearchResults