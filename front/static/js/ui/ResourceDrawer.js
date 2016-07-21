import React from 'react';
import Drawer from 'material-ui/Drawer';
import MenuItem from 'material-ui/MenuItem';
import RaisedButton from 'material-ui/RaisedButton';
import AppBar from 'material-ui/AppBar'
import IconButton from 'material-ui/IconButton';
import NavigationClose from 'material-ui/svg-icons/navigation/close';


const ResourceDrawer = (props) => (
  <div>
    <Drawer open={props.open}>
      <AppBar 
        title="Resources"
        showMenuIconButton={false}
        iconElementRight={<IconButton onClick={props.toggleDrawer}><NavigationClose /></IconButton>}
      />
      <MenuItem><a target="_blank" href="https://factual.namely.com/">Namely</a></MenuItem>
      <MenuItem><a target="_blank" href="https://www.expensify.com/signin">Expensify</a></MenuItem>
      <MenuItem><a target="_blank" href="https://app.greenhouse.io/">Greenhouse</a></MenuItem>
      <MenuItem><a target="_blank" href="https://my.vanguardplan.com/">Vanguard</a></MenuItem>
      <MenuItem><a target="_blank" href="http://wiki.corp.factual.com/">Wiki</a></MenuItem>
      <MenuItem><a target="_blank" href="http://jobtracker-dev.la.prod.factual.com:8088/cluster">Job Tracker</a></MenuItem>
      <MenuItem><a target="_blank" href="http://jobtracker-dev.la.prod.factual.com:19888/jobhistory">Job Tracker</a></MenuItem>
      <MenuItem><a target="_blank" href="http://vineyard.prod.factual.com/">Vineyard</a></MenuItem>
      <MenuItem><a target="_blank" href="http://stitch.corp.factual.com/">Stitch</a></MenuItem>
      <MenuItem><a target="_blank" href="http://marathon.la.prod.factual.com/ui/">Marathon</a></MenuItem>
      <MenuItem><a target="_blank" href="http://mesos.la.prod.factual.com/">Mesos</a></MenuItem>
      <MenuItem><a target="_blank" href="http://dashboard.prod.factual.com/">Dashboard</a></MenuItem>
    </Drawer>
  </div>
);

export default ResourceDrawer