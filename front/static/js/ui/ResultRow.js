import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import Divider from 'material-ui/Divider';

let styles = {
  resultCard: {
    margin: '15px',
    textAlign: 'left'
  },
  resultTitle: {
    color: "#f5f5f5"
  },
  subRow: {
    width: '100%'
  },
  description: {
    color: 'grey',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  }
}

const ResultRow = (props) => (
  <a target="_blank" href={props.url}>
    <Card style={styles.resultCard} >
      <CardHeader title={props.description} subtitle={props.title} />
      <Divider />
      <CardText style={styles.description}>
        {props.url}
      </CardText>
    </Card>
  </a>
);


export default ResultRow;