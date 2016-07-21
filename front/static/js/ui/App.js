import React from 'react';
import Home from './Home';
import baseTheme from 'material-ui/styles/baseThemes/darkBaseTheme';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';


const styles = {
  container: {
    height: '100%',
  },
};

const App = () => (
  <div style={styles.container}>
    < Home />
  </div>
);

export default App;