import React, { Component } from 'react';
import { Container, List, Segment, Grid, Header, Icon } from 'semantic-ui-react';

class Carousel extends Component {
  render() {
    return (
      <div style={{marginTop: '80px'}}>
        <Segment inverted vertical>
        <Container>
          <List inverted floated='right' horizontal>
            <List.Item href='#'><Icon className='heart'/> We Love Electric Boards! </List.Item>
          </List>

          <List inverted horizontal>
            <List.Item href='#'>About Us</List.Item>
            <List.Item href='#'>Contact</List.Item>
          </List>
          </Container>
        </Segment>
      </div>
    )
  }
}

export default Carousel;


  