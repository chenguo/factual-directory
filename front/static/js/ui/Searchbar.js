import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';

const searchStyles = {
  wrapper: {
    width: "60%",
    margin: "auto",
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

const Searchbar = () => (
  <div style={searchStyles.wrapper}>
    <img style={searchStyles.icon} src="/resources/factual_logo_notext.png"/>
    <AutoComplete
      floatingLabelText="Search factual"
      filter={AutoComplete.fuzzyFilter}
      dataSource={searchTerms}
      maxSearchResults={5}
      fullWidth={true}
    />
  </div>
);

export default Searchbar;