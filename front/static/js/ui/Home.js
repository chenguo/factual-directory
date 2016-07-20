import React from 'react';
import Searchbar from './Searchbar'

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200,
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
    <h1> Factual Directory </h1>
    < Searchbar />
  </div>
);

export default Home;