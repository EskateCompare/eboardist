import PropTypes from 'prop-types'
import React, { Component } from 'react'
import { NavLink, Link, Redirect } from 'react-router-dom'
import {
  Button,
  Container,
  Divider,
  Dropdown,
  Grid,
  Header,
  Icon,
  Image,
  List,
  Menu,
  Responsive,
  Segment,
  Sidebar,
  Visibility,
  Input,
  Search
} from 'semantic-ui-react'
import _ from 'lodash';

import { boardType, terrainType } from '../../constants'

class Home extends Component {
  constructor() {
    super()

    this.state = { link: false, fixed: false }


    this.state = {
      link: false,
      fixed: false,
      boardType: 'skateboard',
    }

    this.handleResultSelect = this.handleResultSelect.bind(this);
    this.handleOnBoardTypeSelect = this.handleOnBoardTypeSelect.bind(this);
    this.handleNavClick = this.handleNavClick.bind(this);
    this.handleNavClickAllProducts = this.handleNavClickAllProducts.bind(this);
    this.handleOnTextSearchChange = this.handleOnTextSearchChange.bind(this);
  }

  componentDidMount() {
    document.title = 'eboardist'
  }

  handleOnBoardTypeSelect(e, target) {
    this.props.onClearFilter()
    this.props.onFilterChange({ style: target.value, checked: true })
    this.setState({boardType: target.value})
  }

  hideFixedMenu = () => this.setState({ fixed: false })
  showFixedMenu = () => this.setState({ fixed: true })

  handleResultSelect(event, data) {
    this.setState({ link: data.result.slug })
  }

  handleNavClick(event, data) {
    this.props.onClearFilter();
    this.props.onFilterChange({ [data.type]: data.name, checked: true });
  }

  handleNavClickAllProducts(event, data) {
    this.props.onClearFilter();
  }

  handleOnTextSearchChange(event, data) {
    this.props.fetchTextSearch(data.value)
  }

  renderBestDeals() {
    const { products } = this.props.products;

    const bestDeals = products.slice(0, 4).map((product, index) =>
      <Image bordered style={{width: '220px', height: '200px'}} src={product.image.source} />
    );

    return bestDeals;
  }

  render() {
    if (this.state.link) {
      return <Redirect push to={`/product/${this.state.link}`} />;
    }


    //const renderedBestDeals = this.renderBestDeals();
    const menuLinkStyle = {'align-self' : 'center'}

    return (
      <Responsive minWidth={Responsive.onlyTablet.minWidth}>
        <Visibility
          once={false}
          onBottomPassed={this.showFixedMenu}
          onBottomPassedReverse={this.hideFixedMenu}
        >
          <Segment
            as='div'
            inverted
            textAlign='center'
            style={{ minHeight: 700, padding: '0em 0em', backgroundSize: 'cover', backgroundImage: "url('https://i.pinimg.com/originals/95/17/2c/95172c428ff98f0ec83d3e9679a863d5.jpg')" }}
            vertical
          >
            <Menu
              fixed={this.state.fixed ? 'top' : null}
              inverted={this.state.fixed}
              pointing={!this.state.fixed}
              secondary={!this.state.fixed}
              size='large'
              style={{border: 'none'}}
            >
              <Container>

                <Link to='/'>
                  <Image src='https://s3.amazonaws.com/eskate-compare/product+images/branding/logos/header-logo-black-final.png' verticalAlign='middle' fluid='false' size='small' style={{'margin-top': '16px', 'margin-right' : '45px'}} />
                </Link>
                <Menu.Item as={NavLink} to='/compare/top-electric-skateboards' name='skateboard' onClick={this.handleNavClickAllProducts} style={menuLinkStyle}>
                  Electric Boards
                </Menu.Item>
                <Menu.Item as={NavLink} to='/compare/top-electric-longboards' name='longboard' onClick={this.handleNavClick} style={menuLinkStyle}>
                  Electric Long Boards
                </Menu.Item>
                <Menu.Item as={NavLink} to='/compare/top-electric-pennyboards' name='pennyboard' onClick={this.handleNavClick} style={menuLinkStyle}>
                Electric Penny Boards
                </Menu.Item>



                <Menu.Item position='right'>
                  <Search
                    onSearchChange={_.debounce(this.handleOnTextSearchChange, 250, { leading: false })}
                    onResultSelect={this.handleResultSelect}
                    loading={this.props.fetching}
                    results={this.props.searchResults}
                    placeholder='Search...' />
                  </Menu.Item>
              </Container>
            </Menu>
            <Container text>
              <Header
                as='h1'
                inverted
                content='Find your Perfect Electric Skateboard!'
                style={{
                  fontSize: '2em',
                  fontWeight: 'normal',
                  marginBottom: 0,
                  marginTop: '5em',
                }}
              />
              <Dropdown
                placeholder='Board Type'
                selection
                options={boardType}
                onChange={this.handleOnBoardTypeSelect}
              />{' '}
              <Link to={`/compare/top-electric-${this.state.boardType}s`}><Button size='big' color='green'>Find</Button></Link>
            </Container>
          </Segment>
        </Visibility>
        <Segment style={{ padding: '4em 0em' }} vertical>
          <Container>
          <Header as='h1' content="Explore Electric Skateboards"/>
            <Grid columns={4} container stackable>

              <Grid.Column>
                <br />
                <List link>
                  <Header as='h5' content='Top Brands'/>
                  <List.Item as={Link} to='/compare/top-boosted-electric-skateboards' name='Boosted' type='brands' onClick={this.handleNavClick}>Boosted</List.Item>
                  <List.Item as={Link} to='/compare/top-evolve-electric-skateboards' name='Evolve' type='brands' onClick={this.handleNavClick}>Evolve</List.Item>
                  <List.Item as={Link} to='/compare/top-inboard-electric-skateboards' name='Inboard' type='brands' onClick={this.handleNavClick}>InBoard</List.Item>
                  <List.Item as={Link} to='/compare/top-halo-electric-skateboards' name='Halo' type='brands' onClick={this.handleNavClick}>Halo</List.Item>
                  <List.Item as={Link} to='/compare/top-soflow-skateboards' name='SoFlow' type='brands' onClick={this.handleNavClick}>SoFlow</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
              <br />
                <List link>
                  <Header as='h5' content='Top Overall'/>
                  <List.Item as={Link} to='/compare/top-electric-longboards' name='longboard' type='style' onClick={this.handleNavClick}>Electric Longboards</List.Item>
                  <List.Item as={Link} to='/compare/top-electric-pennyboards' name='pennyboard' type='style' onClick={this.handleNavClick}>Electric Pennyboards</List.Item>
                  <br />
                  <List.Item as={Link} to='/compare/top-electric-skateboards-under-500' name={['0-250', '250-500']} type='price' onClick={this.handleNavClick}>Electric Skateboards Under 500</List.Item>
                  <List.Item as={Link} to='/compare/top-electric-skateboards-under-1000' name={['0-250', '250-500', '500-1000']} type='price' onClick={this.handleNavClick}>Electric Skateboards Under 1000</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
              <br />
                <List link>
                  <Header as='h5' content='Top Features'/>
                  <List.Item as={Link} to='/compare/top-all-terrain-electric-skateboards' name='all' type='terrain' onClick={this.handleNavClick}>All Terrain</List.Item>
                  <List.Item as={Link} to='/compare/top-waterproof-electric-skateboards' name='water resistant' type='features' onClick={this.handleNavClick}>Waterproof</List.Item>
                  <List.Item as={Link} to='/compare/top-travel-safe-electric-skateboards' name='travel safe' type='features' onClick={this.handleNavClick}>Travel Safe</List.Item>
                  <br />
                  <List.Item as={Link} to='/compare/top-fastest-electric-skateboards' name='25+' type='speed' onClick={this.handleNavClick}>Fastest</List.Item>
                  <List.Item as={Link} to='/compare/top-longest-range-electric-skateboards' name='24+' type='range' onClick={this.handleNavClick}>Longest Range</List.Item>
                  <List.Item as={Link} to='/compare/top-newest-electric-skateboards' name='2018' type='year' onClick={this.handleNavClick}>Newest</List.Item>
                </List>
              </Grid.Column>
              <Grid.Column>
              <br />
                <List link>
                <Header as='h5' content='Material Type'/>
                  <List.Item as={Link} to='/compare/top-bamboo-electric-skateboards' name='bamboo' type='deckMaterials' onClick={this.handleNavClick}>Bamboo</List.Item>
                  <List.Item as={Link} to='/compare/top-carbon-fiber-electric-skateboards' name='carbon fiber' type='deckMaterials' onClick={this.handleNavClick}>Carbon Fiber</List.Item>
                  <List.Item as={Link} to='/compare/top-wood-electric-skateboards' name='wood' type='deckMaterials' onClick={this.handleNavClick}>Wood</List.Item>
                  <br />
                  <Header as='h5' content='Motor Type'/>
                  <List.Item as={Link} to='/compare/top-hub-motor-electric-skateboards' name='hub motor' type='drive' onClick={this.handleNavClick}>Hub</List.Item>
                  <List.Item as={Link} to='/compare/top-belt-electric-skateboards' name='belt' type='drive' onClick={this.handleNavClick}>Belt</List.Item>
                </List>
              </Grid.Column>
            </Grid>
          </Container>
        </Segment>

      </Responsive>
    )
  }
}

export default Home;


 // <Segment style={{ padding: '2em 0em'}} vertical>
        //   <Container>
        //     <Header as='h3' style={{ fontSize: '2em' }}>
        //       Recent Best Deals
        //     </Header>
        //     <Image.Group size='small'>
        //       {renderedBestDeals}
        //     </Image.Group>
        //   </Container>
        // </Segment>
