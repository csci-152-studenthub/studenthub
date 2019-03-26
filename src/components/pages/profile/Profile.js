import React, { Component } from 'react'
import { Avatar, message, Input, List, Skeleton, Popconfirm, Icon, Typography, Button } from 'antd';

import './profile.css';


const { Title } = Typography;
export class Profile extends Component {
  render() {
    return (
      <div className="profile-container">
        <div className="item-profile">
          <Title>Profile</Title>
          <h3>This is the profile area. Will expand the more things put in this container</h3>
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
