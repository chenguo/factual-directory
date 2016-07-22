import React from 'react';
import {Card, CardActions, CardHeader, CardText} from 'material-ui/Card';
import FlatButton from 'material-ui/FlatButton';
import Chip from 'material-ui/Chip';
import Divider from 'material-ui/Divider';
import Avatar from 'material-ui/Avatar';
import FontIcon from 'material-ui/FontIcon';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';


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

  componentWillReceiveProps(nextProps) {
    this.setState(nextProps)
  }

  handleExpandChange(expanded) {
    this.setState({expanded: expanded});
  };

  addManualLabel(text) {
    this.setState({manual_tags: manual_tags.concat([text])})
  }

  render() {
    let codeAvatar = <Avatar icon={<FontIcon className="material-icons">code</FontIcon>} />
    let githubAvatar = <Avatar icon={<FontIcon className="fa fa-github"></FontIcon>} />
    let hdfsAvatar = <Avatar icon={<FontIcon className="material-icons">cloud circle</FontIcon>} />
    let wikiAvatar = <Avatar icon={<FontIcon className="material-icons">description</FontIcon>} />

    var icon = wikiAvatar
    if (this.state.url.indexOf("github.com") != -1) {
      icon = codeAvatar
    } else if (this.state.url.indexOf("hdfs-redirect") != -1) {
      icon = hdfsAvatar
    }

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
                      actAsExpander={true} 
                      avatar={icon}
                      />
          <Divider />
          <CardText style={styles.descriptionChips} >
            {fixedTags}
          </CardText>
          <CardText expandable={true} style={{ paddingTop: 0 }} >
            {manualTags}
          </CardText>
        </Card>

    );
  }
}

export default ResultRow;
