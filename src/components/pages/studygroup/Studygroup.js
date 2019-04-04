import React, { Component } from 'react';
import {message, Typography, Button, Form, Input, Icon} from 'antd';
import uuid from "uuid";
import './Studygroup.css';
import { API, Auth} from "aws-amplify";

const { Title } = Typography;

export class Studygroup extends Component {
  constructor(props){
    super(props);

    this.state = {
      currentUser: '',
      studygroup_name: '',
      studygroup_description: '',
    }

    this.getStudygroups = this.getStudygroups.bind(this);
    this.createStudygroup = this.createStudygroup.bind(this);
  }

  async componentDidMount(){
    this.props.handler("Study Groups");
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({currentUser: user.attributes.email})
    }).catch(err => console.log(err));
  }

  async getStudygroups(){
    console.log("Getting studygroups...");
    let user = this.state.currentUser;

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: user
    };
    await API.post(apiName, path, myInit)
      .then((response) => {
        console.log('Success: ', response);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  async createStudygroup(){
    var studygroup_name = this.state.studygroup_name;
    var studygroup_description = this.state.studygroup_description;
    var created_by = this.state.currentUser;
    var timestamp = new Date().toLocaleString();
    var groupId = 'studygroup-'+uuid.v4().toString();
    let members = ['Erick', 'Leng', 'Nina', 'Stanley', 'Steven'];

    console.log('User created studygroup: '+studygroup_name);
    // this.setState({confirmModalLoading: true});

    let apiName = 'posts';
    let path = '/studygroups/create-studygroup';
    let myInit = {
      body: {groupId, studygroup_name, studygroup_description, created_by, timestamp, members}
    };
    await API.post(apiName, path, myInit).then(response => {
      // this.setState({confirmModalLoading: false});
      console.log('Created Studygroup with name: ', studygroup_name);

      // if(response.body.success){
      //   message.success(response.body.success)
      //   this.setState({modalVisible: false});
      // } else{
      //   message.error(response.body.error)
      // }
      console.log(response);
    }).catch(error => {
      // this.setState({confirmModalLoading: false});
      message.error('Could not create studygroup.');
      console.log(error)
    });
  }


  render() {
    return (
      <div className="studygroup-container">
        <Title>Studygroup Page</Title>
        <div>
          <Title level={3}>My Study groups</Title>
          <Button type="primary" onClick={this.getStudygroups}>Get Studygroups</Button>
        </div>
      </div>
    )
  }
}

export default Studygroup
