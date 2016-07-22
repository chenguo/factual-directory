import React from 'react';
import SearchBarContainer from './containers/SearchBarContainer'
import ResourceDrawerContainer from './containers/ResourceDrawerContainer'
import NavBarContainer from './containers/NavBarContainer'
import SearchResultsContainer from './containers/SearchResultsContainer'
import Footer from './Footer'

const styles = {
  container: {
    textAlign: 'center',
    minHeight: '70vh',
    maxHeight: '90vh',
    backgroundColor: 'white'
  },
  searchArea: {
    width: '60%',
    margin: 'auto'
  },
  h: {
    color: 'black',
    fontFamily: 'Roboto',
    'height': '100vh'
  },
};

const Home = () => (
  <div style={styles.h}>
    < NavBarContainer />
    < ResourceDrawerContainer />
    <div style={Object.assign(styles.container, styles.searchArea)}>
      < SearchBarContainer />
      < SearchResultsContainer />
    </div>
    < Footer />
  </div>
);

export default Home;
