import { apiEndpoint } from '../config'
import { User } from '../types/User';
import { Follower } from '../types/Follower';
import Axios from 'axios'

export async function getUser(idToken: string): Promise<User> {
  console.log('Fetching User')

  const response = await Axios.get(`${apiEndpoint}/user`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  }) 
  
  return response.data.item
}

export async function getUsers(idToken: string): Promise<User[]> {
  console.log('Fetching Users')

  const response = await Axios.get(`${apiEndpoint}/users`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  }) 
  
  return response.data.items
}

export async function getFollowers(idToken: string): Promise<Follower[]> {
  console.log('Fetching Followers')

  const response = await Axios.get(`${apiEndpoint}/followers`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  }) 
  
  return response.data.items
}

export async function patchUser(
  idToken: string,
  user: User
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/user`, JSON.stringify({"firstName":user.firstName,
  "lastName":user.lastName,
  "emailId":user.emailId
}), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function followUser(
  idToken: string,
  followId: string
): Promise<void> {
  await Axios.post(`${apiEndpoint}/follow`, JSON.stringify({
    "followId":followId
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function unfollowUser(
  idToken: string,
  followId: string
): Promise<void> {
  await Axios.post(`${apiEndpoint}/unfollow`, JSON.stringify({
    "followId":followId
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}



