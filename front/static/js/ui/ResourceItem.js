import React from 'react';
import ListItem from 'material-ui/List';


const ResourceItem = ({ title, url, description }) => (
    <ListItem primaryText={ title } 
              secondaryText={ description }/>
)

export default ResourceItem