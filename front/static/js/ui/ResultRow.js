import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';


const ResultRow = (props) => (
  <Card>
    <CardHeader title={props.description} subtitle={props.url} />
    <Divider />
    <CardText>
      {props.corpus}
    </CardText>
  </Card>
);


export default ResultRow;