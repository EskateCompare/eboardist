import React, { Component } from 'react';
import ListItem from './ListItem';
import { Button, Icon, Grid, Dropdown, Table, Segment, Dimmer, Loader } from 'semantic-ui-react';
import sortingOptions from '../constants'

export default class ProductList extends Component {
  constructor(){
    super();

    this.state = {
      sortIcon: 'sort amount down',
      filterText: 'Sort By',
    }

    this.handleSortDirection = this.handleSortDirection.bind(this);
    this.handleSortBy = this.handleSortBy.bind(this);
    this.appendListItems = this.appendListItems.bind(this);
  }

  componentDidMount(){
    this.props.onSortDirection({ page: 1 })
  }

  componentWillUnMount(){
    this.props.onSortDirection({ page: 1 })
  }

  handleSortDirection(e, target) {
    const { onSortDirection } = this.props;
    const { sortIcon } = this.state;

    if (sortIcon === 'sort amount up') {
      this.setState({ sortIcon: 'sort amount down' });
      onSortDirection({ sortDir: 'dsc', page: 1 })
    }
    if (sortIcon === 'sort amount down') {
      this.setState({ sortIcon: 'sort amount up' });
      onSortDirection({ sortDir: 'asc' , page: 1 })
    }
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { fetchProducts, filterState } = this.props;

    if (prevProps.filterState !== filterState) {
      fetchProducts(filterState);
    } 
  }

  handleSortBy(e, value) {
    const { onSortBy } = this.props;

    this.setState({ filterText: value.text });
    onSortBy({ sortBy: value.text, page: 1 })
  }

  appendListItems() {
    const { incrementPage } = this.props;

    incrementPage();
  }

  renderListItems() {
    const { products } = this.props.products;
 
    const listItems = products.map((product, index) =>
      <ListItem key={index} product={product} rank={index + 1}/>
    );

    return listItems;
  }

  renderDropdownItems() {
    const dropdownItems = sortingOptions.map((option, index) =>
      <Dropdown.Item key={index} onClick={this.handleSortBy} text={option} />
    );

    return dropdownItems;
  }

  render() {
    const { sortIcon, filterText } = this.state;
    const renderedListItems = this.renderListItems();
    const renderedDropdownItems = this.renderDropdownItems();

    if (this.props.fetching) {
      return (
        <Segment style={{padding: '10em 0', margin: '64px 0'}} vertical size='huge'>
          <Dimmer inverted active>
            <Loader size='massive'>Loading</Loader>
          </Dimmer>
        </Segment>
      )
    }

    return (
      <div>
        <Grid>
          <Grid.Column floated='left' width={2}>
            <Button icon={sortIcon} onClick={this.handleSortDirection}/>
          </Grid.Column>
          <Grid.Column floated='right' width={3}>
            <Dropdown text={filterText} icon='sort' floating labeled button className='icon'>
              <Dropdown.Menu>
                {renderedDropdownItems}
              </Dropdown.Menu>
            </Dropdown>
          </Grid.Column>
        </Grid>
        <Table textAlign='center' basic='very' striped selectable>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell><Icon name='trophy'/></Table.HeaderCell>
              <Table.HeaderCell><Icon name='image'/></Table.HeaderCell>
              <Table.HeaderCell textAlign='center' verticalAlign='middle'>Board</Table.HeaderCell>
              <Table.HeaderCell>Max Speed</Table.HeaderCell>
              <Table.HeaderCell>Range</Table.HeaderCell>
              <Table.HeaderCell>Price</Table.HeaderCell>
              <Table.HeaderCell>Score</Table.HeaderCell>
            </Table.Row>
          </Table.Header>

          <Table.Body>
            {renderedListItems}
          </Table.Body>

        </Table>
        <Button fluid content='Load More' onClick={this.appendListItems}/>
      </div>
    );
  }
}
