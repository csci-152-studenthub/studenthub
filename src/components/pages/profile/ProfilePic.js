import React, { Component } from 'react'
import { Avatar } from 'antd';

export class ProfilePic extends Component {

	constructor(props){
    super(props);

  }

  render() {
    return (
      <Avatar size={this.props.size ? this.props.size : 64}  style={{ backgroundColor: '#1890FF' }} icon="user" />
    )
  }
}

export default ProfilePic
