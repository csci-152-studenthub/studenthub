import React, { Component } from 'react'
import { Avatar, message, Input, List, Skeleton, Popconfirm, Icon, Typography, Button } from 'antd';
import ProfilePic from './ProfilePic';
import { Auth, API } from "aws-amplify";
import './profile.css';


const { Title } = Typography;
export class Profile extends Component {
  constructor(props){
    super();

    this.state ={
      email: '',
      user: '',
      bio:'',
      phone:'',
      post:[],
    }

  
  }
  async componentDidMount(){
    Auth.currentAuthenticatedUser({
        bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
    })
    .catch(err => console.log(err));
  }

  // handleUser(){
  //   
  // }


  render() {
    return (
      <div className="profile-container">
        <div className="item-profile">
          <div className="item-profile-user">
            <ProfilePic />
            <h2>{this.state.user.split('@')[0]}</h2>
          </div>
          <div className="item-profile-body">
            <h3>This is the profile area. Will expand the more things put in this container</h3>
          </div>
        </div>
       
        <span className="gray-col"></span>

        <div className="profile-body">
          <h3>This is where the profile info area</h3>
        </div>
      </div>
    )
  }
}

export default Profile
