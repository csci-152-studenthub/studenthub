import React, { Component } from 'react'
import { Avatar } from 'antd';
import dummyImg from '../../../react-logo.png';

export class ProfilePic extends Component {

	constructor(props){
    super();

    this.state ={
     source:''
		}
		// this.handleImage = this.handleImage.bind(this);
  }

	async componentDidMount(){
		this.setState({source: dummyImg});
	}

	// handleImage(){
	// 	return <img src={this.state.source}/>
	// }

  render() {
    return (
          <Avatar size={64} src={this.state.source}/>
    )
  }
}

export default ProfilePic
