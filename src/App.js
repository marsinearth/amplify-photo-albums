import React, { Component } from 'react';
import {BrowserRouter as Router, Route, NavLink} from 'react-router-dom';
import { Grid } from 'semantic-ui-react';
import { withAuthenticator } from 'aws-amplify-react';
import Amplify from 'aws-amplify';
import aws_exports from './aws-exports';

import AlbumsListLoader from './components/albums/albumList';
import AlbumDetailsLoader from './components/albums/albumDetail';
import NewAlbum from './components/albums/newAlbum';

Amplify.configure(aws_exports);
class App extends Component {
  render() {
    return (
      <Router>
        <Grid padded>
          <Grid.Column>
            <Route path="/" exact component={NewAlbum}/>
            <Route path="/" exact component={AlbumsListLoader}/>

            <Route
              path="/albums/:albumId"
              render={() => <div><NavLink to='/'>Back to Albums list</NavLink></div>}
            />
            <Route
              path="/albums/:albumId"
              render={ props => <AlbumDetailsLoader id={props.match.params.albumId}/> }
            />
          </Grid.Column>
        </Grid>
      </Router>
    );
  }
}

export default withAuthenticator(App, true);