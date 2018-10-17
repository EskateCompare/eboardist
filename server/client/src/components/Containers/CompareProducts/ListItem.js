import React, { Component } from 'react';
import { Image, Label, Table, Icon, Popup } from 'semantic-ui-react';
import { Redirect } from 'react-router-dom';
import Rating from '../Product/Rating';

export default class ListItem extends Component {
  constructor(props){
    super(props);

    this.state = {
      link: false,
    }

    this.handleRowClick = this.handleRowClick.bind(this);
  }

  handleRowClick(e, value) {
    this.setState({ link: true });
  }

  render() {
    const { rank, product } = this.props;
    const { image, specs,  ratings, name, bestPrice, thumbnail } = product;
    const {  speed, range } = specs;

    if (this.state.link) {
      return <Redirect push to={`/product/${this.props.product.slug}`} />;
    }

    return (
      <Table.Row onClick={this.handleRowClick}>
        <Table.Cell verticalAlign='middle'>#{rank}</Table.Cell>
        <Table.Cell verticalAlign='middle'><Image centered src={thumbnail != undefined ? thumbnail.source : image.source} size='tiny' /></Table.Cell>
        <Table.Cell verticalAlign='middle'>{name}</Table.Cell>
        <Table.Cell verticalAlign='middle'>{speed} mph</Table.Cell>
        <Table.Cell verticalAlign='middle'>{range} m</Table.Cell>
        <Table.Cell verticalAlign='middle'>{bestPrice != null ? '$' + bestPrice.toFixed(2) : "-"}</Table.Cell>
        <Table.Cell verticalAlign='middle'>

        <Rating ratings={ratings} size='large' />
        </Table.Cell>
      </Table.Row>
    )
  }
}
