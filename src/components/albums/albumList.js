import React, { PureComponent } from 'react';
import { Header, List, Segment } from 'semantic-ui-react';
import { graphqlOperation } from 'aws-amplify';
import { Connect } from 'aws-amplify-react';
import { NavLink } from 'react-router-dom';
import { makeComparator } from '../../utils/compare';
import { listAlbums } from '../../graphql/queries';
import { onCreateAlbum } from '../../graphql/subscriptions';

class AlbumsList extends PureComponent {
  albumItems() {
    return this.props.albums.sort(makeComparator('name')).map(album =>
      <List.Item key={album.id}>
        <NavLink to={`/albums/${album.id}`}>{album.name}</NavLink>
      </List.Item>
    );
  }

  render() {
    return (
      <Segment>
        <Header as='h3'>My Albums</Header>
        <List divided relaxed>
          {this.albumItems()}
        </List>
      </Segment>
    );
  }
}

export default class AlbumsListLoader extends PureComponent {
  onNewAlbum = (prevQuery, newData) => {
    // When we get data about a new album, we need to put in into an object
    // with the same shape as the original query results, but with the new data added as well
    let updatedQuery = Object.assign({}, prevQuery);
    updatedQuery.listAlbums.items = prevQuery.listAlbums.items.concat([newData.onCreateAlbum]);
    return updatedQuery;
  }

  render() {
    return (
      <Connect
        query={graphqlOperation(listAlbums, { limit: 9999 })}
        subscription={graphqlOperation(onCreateAlbum)}
        onSubscriptionMsg={this.onNewAlbum}
      >
        {({ data, loading }) => {
          if (loading) { 
            return <div>Loading...</div>; 
          }
          if (!data.listAlbums) {
            return;
          }
          return <AlbumsList albums={data.listAlbums.items} />;
        }}
      </Connect>
    );
  }
}