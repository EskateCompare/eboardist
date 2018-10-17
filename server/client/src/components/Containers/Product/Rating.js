import React from 'react';

import { Label, Popup, Icon } from 'semantic-ui-react';

export default class Rating extends React.Component {

  render() {
    const { ratings, size } = this.props;
    let rating = ratings.compositeScore;
    let recommendations = ratings.recommendations;
    if (rating == null) {
      return (

        <Popup trigger = {
          <Icon name='question circle outline' size={size}/>
          }
            content='No ratings yet!'
       />

      )
    }

    let color = undefined;

    if (rating >= 85) { color = 'green' }
    if (rating >= 75 && rating <= 84) { color = 'olive' }
    if (rating >= 65 && rating <= 74) { color = 'yellow' }
    if (rating >= 50 && rating <= 64) { color = 'orange' }
    if (rating < 50) { color = 'red' }

    if (rating != null) {
      return (
        <Popup trigger = {
        <Label color={color} size={size}>
          {Math.round(rating)}
        </Label>
        }
        content={recommendations.yes + ' recommend.\n' + recommendations.no + ' advise against.'} />
      )
    }
  }
}
