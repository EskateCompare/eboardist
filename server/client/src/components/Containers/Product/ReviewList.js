import React, { Component } from 'react';
import { Header, Feed, Rating, Divider, Form, Button, Segment, Input, Comment, Statistic, Icon, Message, Transition, Grid } from 'semantic-ui-react';

const image = 'https://react.semantic-ui.com/images/wireframe/square-image.png';

export default class ReviewList extends Component {
  constructor(props) {
    super(props)

    let recommend = '';
    let didUserRecommend = false;
    let didUserImpression = false;

    for (let recommendation of props.user.recommendations){
      if (recommendation.product === props.slug){
        recommend = recommendation.recommend
        didUserRecommend = true
      }
    }

    if (props.user.impressions) {
      didUserImpression = props.user.impressions.find((impression) => impression.name === props.slug)
    }

    this.state = {
      recommend: recommend,
      didUserRecommend: didUserRecommend,
      impressions: didUserImpression ? didUserImpression.impressions : undefined,
      didUserImpression: didUserImpression ? true : false,
      visible: true,

    }

    this.handleRecommend = this.handleRecommend.bind(this);
    this.handleImpression = this.handleImpression.bind(this);
    this.toggleVisibility = this.toggleVisibility.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { user, slug } = this.props;

    if (prevState.didUserImpression !== this.state.didUserImpression) {
      const didUserImpression = user.impressions.find((impression) => impression.name === slug)
      this.setState({impressions: didUserImpression.impressions})
    }

  }

  toggleVisibility() {
    this.setState({visible: !this.state.visible})
  }

  handleRecommend(event, target) {
    const { recommend } = this.state;

    if (target.value === recommend) {
      return;
    }

    const { fetchPostRecommend, slug, addUserRecommendation, didUserRecommend } = this.props;

    this.setState({ recommend: target.value })

    const requestObject = {
      product: slug,
      recommendChange: {
        yes: (target.value === 'yes') ? 1 : (recommend === 'yes') ? -1 : 0,
        maybe: (target.value === 'maybe') ? 1 : (recommend === 'maybe') ? -1 : 0,
        no: (target.value === 'no') ? 1 : (recommend === 'no' ) ? -1 : 0,
      }
    }

    addUserRecommendation({
      product: slug,
      recommend: target.value
    });

    fetchPostRecommend(requestObject);
  }

  handleImpression(event, target) {
    const { impressions, didUserImpression } = this.state;

    let eventObj = {
      impressionId: target.customId,
      change: target.value
    }

    let impressionExists;

    if (didUserImpression) {
       impressionExists = impressions.find((impression) => impression.impressionId == eventObj.impressionId)
    }

    if (impressionExists && impressionExists.change === eventObj.change) {
      return
    }

    const { fetchPostImpressions, slug, addUserImpression } = this.props;

    const requestObject =
      {
        'product' : slug,
        'impression' : target.customId,
        'change' : {
          'yes' : (target.value === 'yes') ? 1 : (impressionExists && impressionExists.change=== 'yes') ? -1 : 0,
          'no' : (target.value === 'no') ? 1 : (impressionExists && impressionExists.change === 'no') ? -1 : 0,
        }
      }

    addUserImpression({
      product: slug,
      impressionId: target.customId,
      change: target.value,
    });

    fetchPostImpressions(requestObject);
    this.setState({ didUserImpression: true })
  }

  renderImpressions() {
    const { impressions } = this.props;

    if (impressions.length === 0) {
      return
    }
    
    const renderImpressions = impressions.map((impression, index) => {
      let yesVotes = impression.votes && impression.votes.yes ? impression.votes.yes : 0;
      let noVotes = impression.votes && impression.votes.no ? impression.votes.no : 0;
      let content = impression.impression && impression.impression.content ? impression.impression.content : "";
      return (
        <Grid.Column>
          <Grid style={{ background: '#f8f8f9', borderRadius: '.28571429rem'}} columns={3} celled>
              <Grid.Column width={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {yesVotes - noVotes}
              </Grid.Column>
              <Grid.Column width={10} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                {content}
              </Grid.Column>
              <Grid.Column width={3} style={{display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '0'}}>
                <Button.Group icon vertical>
                  <Button basic icon='angle up' onClick={this.handleImpression} customId={impression.impression.customId} value='yes'></Button>
                  <Button basic icon='angle down' onClick={this.handleImpression} customId={impression.impression.customId} value='no'></Button>
                </Button.Group>
              </Grid.Column>
          </Grid>

        </Grid.Column>
        )
      }
    );

    return renderImpressions;
  }

  render() {
    const { ratings } = this.props;
    const { recommend } = this.state;
    const renderedImpressions = this.renderImpressions();

    return (
      <div>
        <Segment>
          <Header content="Would you recommend this to a friend?"/>
            <Button basic={(recommend === 'yes') ? 0 : 1} color='green' icon='smile outline' content={ratings.recommendations.yes} value='yes' onClick={this.handleRecommend}/>
            <Button basic={(recommend === 'maybe') ? 0 : 1}  icon='meh outline' content={ratings.recommendations.maybe} value='maybe' onClick={this.handleRecommend}/>
            <Button basic={(recommend === 'no') ? 0 : 1}  color='red' icon='frown outline' content={ratings.recommendations.no} value='no' onClick={this.handleRecommend}/>
          </Segment>
        <Segment>
          <Header as='h3'>Impressions</Header>
            <Divider hidden/>
            <Grid container columns={3} stackable>
              {renderedImpressions}
            </Grid>
            <Divider hidden/>
          </Segment>

        </div>
    );
  }
}


// <Segment>
//             <Comment.Group>
//               <Header as='h3'>Discussion</Header>

//               <Comment>
//                 <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/matt.jpg' />
//                 <Comment.Content>
//                   <Comment.Author as='a'>Matt</Comment.Author>
//                   <Comment.Metadata>
//                     <div>Today at 5:42PM</div>
//                   </Comment.Metadata>
//                   <Comment.Text>How artistic!</Comment.Text>
//                   <Comment.Actions>
//                     <Comment.Action>Reply</Comment.Action>
//                   </Comment.Actions>
//                 </Comment.Content>
//               </Comment>

//               <Comment>
//                 <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/elliot.jpg' />
//                 <Comment.Content>
//                   <Comment.Author as='a'>Elliot Fu</Comment.Author>
//                   <Comment.Metadata>
//                     <div>Yesterday at 12:30AM</div>
//                   </Comment.Metadata>
//                   <Comment.Text>
//                     <p>This has been very useful for my research. Thanks as well!</p>
//                   </Comment.Text>
//                   <Comment.Actions>
//                     <Comment.Action>Reply</Comment.Action>
//                   </Comment.Actions>
//                 </Comment.Content>
//                 <Comment.Group>
//                   <Comment>
//                     <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/jenny.jpg' />
//                     <Comment.Content>
//                       <Comment.Author as='a'>Jenny Hess</Comment.Author>
//                       <Comment.Metadata>
//                         <div>Just now</div>
//                       </Comment.Metadata>
//                       <Comment.Text>Elliot you are always so right :)</Comment.Text>
//                       <Comment.Actions>
//                         <Comment.Action>Reply</Comment.Action>
//                       </Comment.Actions>
//                     </Comment.Content>
//                   </Comment>
//                 </Comment.Group>
//               </Comment>

//               <Comment>
//                 <Comment.Avatar src='https://react.semantic-ui.com/images/avatar/small/joe.jpg' />
//                 <Comment.Content>
//                   <Comment.Author as='a'>Joe Henderson</Comment.Author>
//                   <Comment.Metadata>
//                     <div>5 days ago</div>
//                   </Comment.Metadata>
//                   <Comment.Text>Dude, this is awesome. Thanks so much</Comment.Text>
//                   <Comment.Actions>
//                     <Comment.Action>Reply</Comment.Action>
//                   </Comment.Actions>
//                 </Comment.Content>
//               </Comment>

//               <Form reply>
//                 <Form.TextArea />
//                 <Button onClick={this.toggleVisibility} content='Add Comment' primary />
//               </Form>
//             </Comment.Group>
//           </Segment>
