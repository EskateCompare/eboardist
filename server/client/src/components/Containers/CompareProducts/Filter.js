import React, { Component } from 'react';
import { Form, Input, Checkbox, Header, Radio, Icon, Divider, Label } from 'semantic-ui-react';
const queryString = require('query-string');

export default class Filter extends Component {
  constructor() {
    super()

    this.state = {
      showAllOptions: false,
      checkedItems: []
    }

    this.handleFilterSelect = this.handleFilterSelect.bind(this);
    this.handleShowAllOptions = this.handleShowAllOptions.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
    this.clearField = this.clearField.bind(this);
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { filterState, fetchFilter } = this.props;

    if (prevProps.filterState !== filterState ) {
      fetchFilter(filterState);
    }
  }

  handleFilterSelect(e, value) {
    const { checkedItems } = this.state;
    const { title, label, checked } = value;
    const { fetchProducts, onFilterChange, filterState, fetchFilter, history } = this.props;

    onFilterChange({ [title]: label, checked: checked });
    fetchFilter(filterState);
    fetchProducts(filterState);

    const query = queryString.stringify(filterState)

    history.push({
      pathname: `/compare/${query}`,
    })
  }

  handleShowAllOptions() {
    this.setState(prevState =>
      ({ showAllOptions: !prevState.showAllOptions })
    );
  }

  handleFieldChange(e) {
    const { updateField } = this.props;
    updateField( 'brandSearch', e.target.value );
  }

  clearField(key) {
    const { updateField } = this.props;
    updateField(key, '');
  }

  renderFilterGroups() {
    const { filter, brandSearch } = this.props;
    const { showAllOptions } = this.state;

    const filterItems = filter.map((option, index) => {
      let filteredOptions = option.options;
      if (option.title === 'brands' && brandSearch != undefined && brandSearch.length > 0) {
        filteredOptions = filteredOptions.filter(function(checkboxOption) {
          return checkboxOption.label.toLowerCase().includes(brandSearch.toLowerCase())
        })
      }
      return (
        <div key={index}>
          <Form.Group grouped>
            <label><Header as='h4'>{option.displayTitle}</Header></label>
            { option.title === 'brands' ? <SearchOptions handleFieldChange={this.handleFieldChange} clearField={this.clearField} /> : null }
            { option.formType === 'checkbox' ? filteredOptions.slice(0, 5).map((value) => <Checkboxes option={option} value={value} handleFilterSelect={this.handleFilterSelect}/>) : null }
            { showAllOptions ? filteredOptions.slice(5, filteredOptions.length).map((value) => <Checkboxes option={option} value={value} handleFilterSelect={this.handleFilterSelect}/>) : null}
            { filteredOptions.length > 5 && !showAllOptions ? <ShowAllOptionsButton handleShowAllOptions={this.handleShowAllOptions} children={'Show More'}/> : null }
            { filteredOptions.length > 5 && showAllOptions ? <ShowAllOptionsButton handleShowAllOptions={this.handleShowAllOptions} children={'Show Less'}/> : null }
          </Form.Group>
          <Divider />
        </div>
        )
      }
    );

    return filterItems;
  }

  render() {
    const renderedFilterGroups = this.renderFilterGroups();

    return (
      <Form>
        {renderedFilterGroups}
      </Form>
    );
  }
}

class SearchOptions extends Component {

  componentWillUnmount() {
    this.props.clearField('brandSearch');
  }

  render() {
    return (
      <Form.Input icon='search' control={Input} placeholder='Search Brands'
        onChange={this.props.handleFieldChange}
        value={this.props.brandSearch} />
    )
  }
}

class Checkboxes extends Component {
  render() {
    const { option, value, handleFilterSelect } = this.props;

    const hideLabelCountStyle = {
      display: value.checked ? 'none' : null
    }

    return (
      <Form.Field>
        <Checkbox checked={value.checked} label={value.label} title={option.title} onChange={handleFilterSelect}/>
        <Label style={hideLabelCountStyle} circular content={value.count}/>
      </Form.Field>
    )
  }
}

class ShowAllOptionsButton extends Component {
  render() {
    const { handleShowAllOptions, children } = this.props;
    const showButtonStyle = {
      cursor: 'pointer',
      color: 'blue',
    }

    return(
      <div style={showButtonStyle} onClick={handleShowAllOptions}>
        <Icon name='caret down'/>{children}
      </div>
    )
  }
}
