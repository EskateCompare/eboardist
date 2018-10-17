import React, { Component } from 'react';
import { Container, List, Segment, Grid, Header, Icon, Modal, Button, Image, Form, TextArea, Input, Divider } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { fetchPostFeedback } from '../../actions/Main';

const mapStateToProps = state => ({
  ...state.Main
})

const mapDispatchToProps = dispatch => ({
  fetchPostFeedback: (payload) => dispatch(fetchPostFeedback(payload)),
})

class GlobalFooter extends Component {
  constructor() {
    super()

    this.state = { open: false, email: '', content: '' }

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
    this.handleEmailOnChange = this.handleEmailOnChange.bind(this);
    this.handleFeedbackOnChange = this.handleFeedbackOnChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  show(){
    this.setState({ open: true })
  }

  handleFeedbackOnChange(event, target){
    this.setState({ content: target.value})
  }

  handleEmailOnChange(event, target){
    this.setState({ email: target.value })
  }

  close() {
    this.setState({ open: false })
  }

  handleSubmit(event, target) {
    const { fetchPostFeedback } = this.props;
    const { email, content } = this.state;

    const requestObject = {
      feedback: {
        email: email,
        content: content
      }
    }
    
    if (email || content) {
     fetchPostFeedback(requestObject)
    }

    this.close();
  }

  render() {
    const { open } = this.state

    return (
      <div>
        <Segment inverted vertical>
        <Container>
          <List inverted floated='right' horizontal>
            <List.Item href='#'><Icon className='heart'/> We Love Electric Boards! </List.Item>
          </List>

          <List inverted horizontal>
            <List.Item as={Link} to='/about'>About</List.Item>
            <List.Item as='a' onClick={this.show}>Feedback</List.Item>
          </List>
          </Container>
        </Segment>
        <Modal style={{height: '320px'}} className='scrolling' dimmer='inverted' open={open} onClose={this.close}>
          <Modal.Header>Submit Feedback</Modal.Header>
          <Modal.Content>
            <Form>
              <Input onChange={this.handleEmailOnChange} fluid icon='at' placeholder='Email' />
              <Divider hidden/>
              <TextArea onChange={this.handleFeedbackOnChange} autoHeight placeholder='We love hearing from you!' />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button
              primary
              fluid
              content='Submit'
              onClick={this.handleSubmit}
            />
          </Modal.Actions>
        </Modal>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GlobalFooter);


  