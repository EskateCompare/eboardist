import React, { Component } from 'react';
import { Grid, Image, List } from 'semantic-ui-react';
import ReactImageMagnify from 'react-image-magnify';

export default class ImageList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      mainImage: props.images.image.source
    }

    this.handleImageClick = this.handleImageClick.bind(this);
  }

  handleImageClick(e, target) {
    this.setState({ mainImage:  target.children.props.src })
  }

  // renderImages() {
  //   const { image, additionalImages } = this.props.images;

  //   const renderImages = additionalImages.map((image, index) => {
  //     return (
  //       <List.Item onClick={this.handleImageClick}>
  //         <Image src={image.source} />
  //       </List.Item>
  //       )
  //     }
  //   );

  //   return renderImages;
  // }

  render() {
    const { image } = this.props.images;
    const { mainImage } = this.state;

    // this.renderedImages = this.renderImages();

    return (
      <Grid columns={1}>
        <Grid.Column width={16}>
          <ReactImageMagnify {...{
            smallImage: {
                alt: '',
                isFluidWidth: true,
                src: mainImage,
                isFluidWidth: true,
            },
            largeImage: {
                src: mainImage,
                width: 1200,
                height: 1200,
            },
            isHintEnabled: true,
            lensStyle: { backgroundColor: 'rgba(0,0,0,.6)' },
            enlargedImageContainerStyle: { zIndex: '1' }
          }} />
        </Grid.Column>
      </Grid>
    );
  }
}
