import React from 'react';
import Searchbar from './Searchbar'
import ResourceDrawerContainer from './containers/ResourceDrawerContainer'
import NavBarContainer from './containers/NavBarContainer'
import SearchResultsContainer from './containers/SearchResultsContainer'

const styles = {
  container: {
    textAlign: 'center',
    height: '60vh',
    backgroundColor: 'white',
  },
  searchArea: {
    width: '60%',
    margin: 'auto'
  },
  h: {
    color: 'black',
    fontFamily: 'Roboto'
  },
};

const Home = () => (
  <div style={Object.assign(styles.container, styles.h)}>
    < NavBarContainer />
    < ResourceDrawerContainer />
    <div style={styles.searchArea}>
      < Searchbar />
      < SearchResultsContainer />
    </div>
  </div>
);

export default Home;