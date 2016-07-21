import React from 'react';
import Drawer from 'material-ui/Drawer';
import {List, ListItem} from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';
import ResourceItem from './ResourceItem'

let drawerStyles = {
  appbar: {
    marginBottom: '15px'
  }
}

const ResourceDrawer = (props) => (
  <div>
    <Drawer open={props.open}>
      <AppBar 
        title="Resources"
        showMenuIconButton={false}
        iconElementRight={<IconButton onClick={props.toggleDrawer}><NavigationClose /></IconButton>}
        style={drawerStyles.appbar}
      />
      <List>
        <a target="_blank" href="https://factual.namely.com/"> < ListItem primaryText={"Namely"} secondaryText={"a"} /> </a>
        <a target="_blank" href="https://www.expensify.com/signin"> < ListItem primaryText={"Expensify"} secondaryText={"a"} /> </a>
        <a target="_blank" href="https://app.greenhouse.io/"> < ListItem primaryText={"Greenhouse"} secondaryText={"a"} /> </a>
        <a target="_blank" href="https://my.vanguardplan.com/"> < ListItem primaryText={"Vanguard"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://wiki.corp.factual.com/"> < ListItem primaryText={"Wiki"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://jobtracker-dev.la.prod.factual.com:8088/cluster"> < ListItem primaryText={"Job Tracker"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://jobtracker-dev.la.prod.factual.com:19888/jobhistory"> < ListItem primaryText={"Job History"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://vineyard.prod.factual.com/"> < ListItem primaryText={"Vineyard"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://stitch.corp.factual.com/"> < ListItem primaryText={"Stitch"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://marathon.la.prod.factual.com/ui/"> < ListItem primaryText={"Marathon"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://mesos.la.prod.factual.com/"> < ListItem primaryText={"Mesos"} secondaryText={"a"} /> </a>
        <a target="_blank" href="http://dashboard.prod.factual.com/"> < ListItem primaryText={"Dashboard"} secondaryText={"a"} /> </a>
      </List>
    </Drawer>
  </div>
);

export default ResourceDrawer