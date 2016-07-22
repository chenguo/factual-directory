import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import getResults from '../actions/searchActions'


const searchStyles = {
  wrapper: {
    width: "100%",
    display: "flex",
    marginTop: '15px'
  },
  icon: {
    marginRight: "15px"
  }
}

const searchTerms = []

const SearchBar = (props) => (
  <div style={searchStyles.wrapper}>
    <img style={searchStyles.icon} src="/resources/factual_logo_notext.png"/>
    <div style={{marginRight: '20px', width: '100%'}}>
      <AutoComplete
        floatingLabelText="Search factual"
        filter={AutoComplete.fuzzyFilter}
        dataSource={searchTerms}
        maxSearchResults={5}
        fullWidth={true}
        onNewRequest={ props.doSearch }
      />
    </div>
  </div>
);

export default SearchBar;
