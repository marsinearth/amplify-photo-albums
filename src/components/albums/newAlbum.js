import React, { PureComponent } from 'react';
import { Header, Segment, Input } from 'semantic-ui-react';
import { API, graphqlOperation } from 'aws-amplify';
import { createAlbum } from '../../graphql/mutations';

export default class NewAlbum extends PureComponent {
  state = {
    albumName: ''
  };

  handleChange = (event) => {
    let change = {};
    change[event.target.name] = event.target.value;
    this.setState(change);
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    const result = await API.graphql(graphqlOperation(createAlbum, { input: { name: this.state.albumName }}));
    console.info(`Created album with id ${result.data.createAlbum.id}`);
    this.setState({ albumName: '' })
  }

  render() {
    return (
      <Segment>
        <Header as='h3'>Add a new album</Header>
        <Input
          type='text'
          placeholder='New Album Name'
          icon='plus'
          iconPosition='left'
          action={{ content: 'Create', onClick: this.handleSubmit }}
          name='albumName'
          value={this.state.albumName}
          onChange={this.handleChange}
        />
      </Segment>
    )
  }
}