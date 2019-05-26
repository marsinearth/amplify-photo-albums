import React, { PureComponent } from 'react';
import { Form, Header, Segment } from 'semantic-ui-react';
import { graphqlOperation } from 'aws-amplify';
import { API } from 'aws-amplify';
import PhotosList from '../photos/photoList';
import S3ImageUpload from '../photos/photoS3Upload';

const GetAlbum = `query GetAlbum($id: ID!, $nextTokenForPhotos: String) {
  getAlbum(id: $id) {
    id
    name
    photos(sortDirection: DESC, nextToken: $nextTokenForPhotos) {
      nextToken
      items {
        thumbnail {
          width
          height
          key
        }
      }
    }
  }
}`;

class AlbumDetails extends PureComponent {
  render() {
    if (!this.props.album) return 'Loading album...';
    return (
      <Segment>
      <Header as='h3'>{this.props.album.name}</Header>
      <S3ImageUpload albumId={this.props.album.id}/>        
      <PhotosList photos={this.props.album.photos.items} />
      {
        this.props.hasMorePhotos && 
        <Form.Button
          onClick={this.props.loadMorePhotos}
          icon='refresh'
          disabled={this.props.loadingPhotos}
          content={this.props.loadingPhotos ? 'Loading...' : 'Load more photos'}
        />
      }
      </Segment>
    )
  }
}

export default class AlbumDetailsLoader extends PureComponent {
  state = {
    nextTokenForPhotos: null,
    hasMorePhotos: true,
    album: null,
    loading: true
  }

  loadMorePhotos = async () => {
    if (!this.state.hasMorePhotos) return;

    this.setState({ loading: true });
    const { data } = await API.graphql(graphqlOperation(GetAlbum, {id: this.props.id, nextTokenForPhotos: this.state.nextTokenForPhotos}));

    let album;
    if (this.state.album === null) {
      album = data.getAlbum;
    } else {
      album = this.state.album;
      album.photos.items = album.photos.items.concat(data.getAlbum.photos.items);
    }
    this.setState({ 
      album: album,
      loading: false,
      nextTokenForPhotos: data.getAlbum.photos.nextToken,
      hasMorePhotos: data.getAlbum.photos.nextToken !== null
    });
  }

  componentDidMount() {
    this.loadMorePhotos();
  }

  render() {
    return (
      <AlbumDetails 
        loadingPhotos={this.state.loading} 
        album={this.state.album} 
        loadMorePhotos={this.loadMorePhotos.bind(this)} 
        hasMorePhotos={this.state.hasMorePhotos} 
      />
    );
  }
}