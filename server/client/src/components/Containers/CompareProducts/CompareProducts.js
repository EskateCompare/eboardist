import React, { Component } from 'react';
import ProductList from './ProductList';
import Filter from './Filter';
import { Header, Icon, Grid, Label } from 'semantic-ui-react';

export default class CompareProducts extends Component {
  componentDidMount() {
    const { fetchFilter, fetchProducts, filterState } = this.props;
    document.title = "eboardist | Compare Electric Skateboards"

    fetchProducts(filterState);
    fetchFilter(filterState);
  }

  render() {
    const { internalReviewsCount, externalReviewsCount, lastUpdated, totalMatching, totalProducts} = this.props.filter.stats;
    const { products, filterState, onSortBy, onSortDirection, onFilterChange, fetchProducts, fetchFilter, fetching, updateField, brandSearch, history, incrementPage, onClearFilter } = this.props;
    const { filterOptions: filter } = this.props.filter.stats;

    return (
      <div style={{padding: '80px 0'}}>
        <Grid container columns={2} stackable>
          <Grid.Column width={7}>
            <Header floated='left' as='h1'>{totalMatching} best electric boards of {totalProducts}</Header>
          </Grid.Column>
          <Grid.Column floated='right' width={9}>
            <Header floated='right' as='h6'>
              <Label>
                <Icon name='user circle' />
                {internalReviewsCount}
                <Label.Detail>User Recommendations</Label.Detail>
              </Label>
              <Label>
                <Icon name='checkmark' />
                {lastUpdated}
                <Label.Detail>Last Updated</Label.Detail>
              </Label>
            </Header>
          </Grid.Column>
        </Grid>
        <Grid container columns={2} stackable>
          <Grid.Column width={4}>
            <Filter filter={filter} history={history} fetchProducts={fetchProducts} onFilterChange={onFilterChange} filterState={filterState} fetchFilter={fetchFilter} updateField={updateField} brandSearch={brandSearch} />
          </Grid.Column>
          <Grid.Column width={12}>
            <ProductList fetching={fetching} products={products} fetchProducts={fetchProducts} onFilterChange={onFilterChange} onSortBy={onSortBy} onSortDirection={onSortDirection} filterState={filterState} incrementPage={incrementPage}/>
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}
