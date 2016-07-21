import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import getResults from '../actions/searchActions'


const searchStyles = {
  wrapper: {
    width: "100%",
    display: "flex"  
  },
  icon: {
    marginRight: "15px"
  }
}

const searchTerms = [
  'chen is cool',
  'chen sucks',
  'chen guo',
  'buttercup guo',
  'the red chen jumps over the lazy dog'
]

const SearchBar = (props) => (
  <div style={searchStyles.wrapper}>
    <img style={searchStyles.icon} src="/resources/factual_logo_notext.png"/>
    <AutoComplete
      floatingLabelText="Search factual"
      filter={AutoComplete.fuzzyFilter}
      dataSource={searchTerms}
      maxSearchResults={5}
      fullWidth={true}
      onUpdateInput={ props.doSearch }
    />
  </div>
);

export default SearchBar;