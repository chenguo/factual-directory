import React from 'react';
import AutoComplete from 'material-ui/AutoComplete';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const searchTerms = [
  'chen is cool',
  'chen sucks',
  'chen guo',
  'buttercup guo',
  'the red chen jumps over the lazy dog'
]

const Searchbar = () => (
  <div>
  <MuiThemeProvider>
    <AutoComplete
      floatingLabelText="Search factual stuff!"
      filter={AutoComplete.fuzzyFilter}
      dataSource={searchTerms}
      maxSearchResults={5}
    />
  </MuiThemeProvider>
  </div>
);

export default Searchbar;