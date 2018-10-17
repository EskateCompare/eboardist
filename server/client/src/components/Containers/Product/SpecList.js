import React, { Component } from 'react';
import { List } from 'semantic-ui-react';

export default class SpecList extends Component {
  renderSpec() {
    const { displaySpecs } = this.props.specs;

    const renderSpec = displaySpecs.map((spec, index) => {
      const { displayName, icon, value } = spec;

      let displayValue = value;

      if (typeof value === 'boolean') {
        value ? displayValue = 'yes' : displayValue = 'no'
      }

      if (Array.isArray(value)) {
        displayValue = value.join(' | ')
      }

      return (
        <List.Item>
          <List.Content floated='right'>{displayValue}</List.Content>
          <List.Icon name={icon} size='large'/>
          <List.Content>{displayName}</List.Content>
        </List.Item>
        )
      }
    );

    return renderSpec;
  }

  render() {
    const renderedSpec = this.renderSpec();

    return (
      <List divided relaxed='very' verticalAlign='middle'>
        {renderedSpec}
      </List>
    );
  }
}