import * as React from 'react'
import { Form, Button,Divider,Input } from 'semantic-ui-react'
import Auth from '../auth/Auth'
import { getUser } from '../api/user-api'
import { patchUser } from '../api/user-api'
import { User } from '../types/User'
import { userInfo } from 'os'

interface UserProps {
  match: {
    params: {
      userId: string
    }
  }
  auth: Auth
}

interface UserState {
  user: User
}


export class Profile extends React.PureComponent<
UserProps,
UserState
>   {
  state: UserState = {
    user : {
      userId:'',
      firstName:'',
      lastName:'',
      emailId:''
  }
  }
   handleSubmit = async (event: React.SyntheticEvent) => {
    try {
    await patchUser(this.props.auth.getIdToken(),this.state.user)
    alert('Profile Updated!')
    }
    catch (e) {
      alert('Could not update Profile ' + e.message)
    }
  }

  handleFirstNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.user.firstName = event.target.value
  }

  handleLastNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.user.lastName = event.target.value
  }

  handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.state.user.emailId = event.target.value
  }


  render() {
    return (
      <div>
      <h1>Hello {this.state.user.firstName}</h1>
      <Divider />
      <Form onSubmit={this.handleSubmit}>
      <Form.Field width='5'>
      <label>User ID: </label>  
      <Input
        type='text' value= {this.state.user.userId} readOnly 
      /></Form.Field>
      <Form.Field width='5'><label>First Name: </label> 
      <Input
            defaultValue={this.state.user.firstName}  
            onChange={this.handleFirstNameChange}
      /></Form.Field>
      <Form.Field width='5'><label>Last Name: </label> 
      <Input
          defaultValue={this.state.user.lastName}  
          onChange={this.handleLastNameChange}
      /></Form.Field>
       <Form.Field width='5'><label>email ID: </label> 
      <Input
          defaultValue={this.state.user.emailId} 
          onChange={this.handleEmailChange}
      /></Form.Field>
      {this.renderButton()}
      </Form>
      <br></br>
 
      <Divider />
      
      </div>
    );
  }

  renderButton() {

    return (
      <div>
        <Button
          type="submit"
        >
          Update
        </Button>
      </div>
    )
  }

  async componentDidMount() {
    try {
      const user = await getUser(this.props.auth.getIdToken())
      this.setState({
        user
      })
    } catch (e) {
      alert(`Failed to fetch todos: ${e.message}`)
    }
  }


}

