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
  descriptionText: {
    color: 'grey',
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  descriptionChips: {
    display: 'flex',
    overflow: 'scroll',
    whiteSpace: 'nowrap'  
  },
  manulTagEmptyState: {
    textAlign: 'center',
    color: 'grey',
    margin: 0
  },
  chip: {
    margin: 4,
  }
}

class ResultRow extends React.Component {

  constructor(props) {
    super(props);
    let localRowState = {
      expanded: false 
    }
    this.state = Object.assign({}, localRowState, props)
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  };

  render() {
    let fixedTags = (this.state.expanded ? [] : this.state.manual_tags).concat(this.state.keywords).map( (tag, i) => (
        <Chip onTouchTap={(event) => console.log('clicked')}
              style={styles.chip}
              key={i} >
          {tag}
        </Chip>
      ))
    let manualTags = this.state.manual_tags.length > 0 ?
      this.state.manual_tags.map( (tag, i) => (
        <Chip onRequestDelete={(event) => console.log('deleted')}
              onTouchTap={(event) => console.log('clicked')}
              style={styles.chip}
              key={i} >
          {tag}
        </Chip>
      )) :
      <p style={styles.manulTagEmptyState}> No manual tags yet :( </p>
    let resultTitle = 
      <a target="_blank" 
          href={this.state.url} 
          onClick={() => this.props.submitClick(this.state.id)}>
        {this.state.title}
      </a>

    return (
        <Card expanded={this.state.expanded}
              style={styles.resultCard}
              onExpandChange={(expand) => this.handleExpandChange(expand)} >
          <CardHeader title={resultTitle}
                      subtitle={this.state.description}
                      showExpandableButton={true}
                      actAsExpander={true} />
          <Divider />
          <CardText style={styles.descriptionChips} >
            {fixedTags}
          </CardText>
          <CardText expandable={true}>
            {manualTags}
          </CardText>
        </Card>

    );
  }
}

export default ResultRow;
