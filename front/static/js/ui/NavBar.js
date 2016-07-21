import React from 'react';
import AppBar from 'material-ui/AppBar';
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import FlatButton from 'material-ui/FlatButton';

const NavBar = (props) => (
  <AppBar
    iconElementRight={<FlatButton onClick={props.toggleDrawer} label="Tags" />}
    onLeftIconButtonTouchTap={props.toggleDrawer}
  />
);

export default NavBar;