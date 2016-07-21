import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
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

const ResultRow = (props) => {
  let manualTags = props.manual_tags.length > 0 ?
    props.manual_tags.map( (tag, i) => (
      <Chip onRequestDelete={(event) => console.log('deleted')}
            onTouchTap={(event) => console.log('clicked')}
            style={styles.chip}
            key={i} >
        {tag}
      </Chip>
    )) :
    null
  return (
    <a target="_blank" href={props.url}>
      <Card style={styles.resultCard} >
        <CardHeader title={props.description} 
                    subtitle={props.title} 
                    showExpandableButton={true} 
                    actAsExpander={true}/>
        <Divider />
        <CardText style={styles.description}>
          {props.keywords.join(', ')}
        </CardText>
        <CardText expandable={true}>
          {manualTags}
        </CardText>
      </Card>
    </a>
  );
}

export default ResultRow;