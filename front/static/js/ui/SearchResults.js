import React from 'react'
import ResultRow from './ResultRow'

const SearchResults = (props) => {
  if (props.results.length == 0) {
    return null
  } else {
    return (
      <div>
        {props.results.map( (result, i) => <ResultRow {...result} key={i}/> )}
      </div>
    )
  }
}

export default SearchResults