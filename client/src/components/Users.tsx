import dateFormat from 'dateformat'
import { History } from 'history'
import update from 'immutability-helper'
import * as React from 'react'
import { followUser } from '../api/user-api'
import { getFollowers } from '../api/user-api'
import { unfollowUser } from '../api/user-api'
import {
  Button,
  Checkbox,
  Divider,
  Grid,
  Header,
  Icon,
  Input,
  Image,
  Loader
} from 'semantic-ui-react'

import { getUsers } from '../api/user-api'
import Auth from '../auth/Auth'
import { User } from '../types/User'
import { Follower } from '../types/Follower'

interface UsersProps {
  auth: Auth
  history: History
}

interface UsersState {
  users: User[]
  followers:Follower[]
  loadingUsers: boolean
}

export class Users extends React.PureComponent<UsersProps, UsersState> {
  state: UsersState = {
    users: [],
    followers:[],
    loadingUsers: true
  }



  async componentDidMount() {
    try {
      const users = await getUsers(this.props.auth.getIdToken())
      const followers = await getFollowers(this.props.auth.getIdToken())
      this.setState({
        users,
        followers,
        loadingUsers: false
      })

    } catch (e) {
      alert(`Failed to fetch users: ${e.message}`)
    }
  }

  render() {
    return (
      <div>
        <Header as="h1">Users</Header>
        {this.renderUsers()}
        <Header as="h1">Following</Header>
        {this.renderFollowers()}
      </div>
    )
  }

  renderUsers() {
    if (this.state.loadingUsers) {
      return this.renderLoading()
    }

    return this.renderUsersList()
  }

  renderLoading() {
    return (
      <Grid.Row>
        <Loader indeterminate active inline="centered">
          Loading Users
        </Loader>
      </Grid.Row>
    )
  }

   onEditButtonClick = async (followId: string) => {
    try {
    await followUser(this.props.auth.getIdToken(),followId)
    alert("Following User")
    this.setState({
      followers: await getFollowers(this.props.auth.getIdToken()),
      users: await getUsers(this.props.auth.getIdToken())
    })
    this.forceUpdate
    }
    catch{
      alert("Error Following User")
    }
  }
   onDeleteButtonClick = async (followId: string) => {
    try {
      await unfollowUser(this.props.auth.getIdToken(),followId)
    alert("Unfollowed User")
    this.setState({
      followers: this.state.followers.filter(follower => follower.followId != followId),
      users: await getUsers(this.props.auth.getIdToken())
    })
    this.forceUpdate
    }
    catch{
      alert("Error Unfollowing User")
    }
  }

  renderUsersList() {
    return (
      <Grid padded>
        {this.state.users.map((user, pos) => {
          return (
            <Grid.Row key={user.userId}>
              <Grid.Column width={10} verticalAlign="middle">
                {user.userId}
              </Grid.Column>
              <Grid.Column width={10} verticalAlign="middle">
                {user.firstName}
              </Grid.Column>
              <Grid.Column width={3} floated="right">
                {user.lastName}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onEditButtonClick(user.userId)}
                >
                  <Icon name="add user" />
                </Button>
              </Grid.Column>
              <Grid.Column width={16}>
                <Divider />
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

  renderFollowers() {

    return (
      <Grid padded>
        {this.state.followers.map((follower, pos) => {
          return (
            <Grid.Row key={follower.followId}>
              <Grid.Column width={10} verticalAlign="middle">
                {follower.followId}
              </Grid.Column>
              <Grid.Column width={1} floated="right">
                <Button
                  icon
                  color="blue"
                  onClick={() => this.onDeleteButtonClick(follower.followId)}
                >
                  <Icon name="remove user" />
                </Button>
              </Grid.Column>
            </Grid.Row>
          )
        })}
      </Grid>
    )
  }

}
