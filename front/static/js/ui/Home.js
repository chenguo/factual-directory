import React from 'react';
import Searchbar from './Searchbar'
import ResourceDrawerContainer from './containers/ResourceDrawerContainer'
import NavBarContainer from './containers/NavBarContainer'

const styles = {
  container: {
    textAlign: 'center',
    height: '60vh',
    backgroundColor: 'white',
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
    < Searchbar />
  </div>
);

export default Home;