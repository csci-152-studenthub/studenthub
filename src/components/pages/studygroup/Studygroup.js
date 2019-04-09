import React, { Component } from 'react';
import { message, Typography, Button, Modal, Card, List } from 'antd';
import uuid from "uuid";
import { API, Auth} from "aws-amplify";
import CreateStudyGroupForm from './createStudyGroup';
import "./Studygroup.css";

const { Meta } = Card;
const { Title, Text } = Typography;
export class Studygroup extends Component {
  constructor(props){
    super(props);

    this.state = {
      study_groups:[]
    }

    this.getStudygroups = this.getStudygroups.bind(this);
  }

  async componentDidMount(){
    this.props.handler("Study Groups");
    Auth.currentAuthenticatedUser({
      bypassCache: false  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({currentUser: user.attributes.email})
    }).catch(err => console.log(err));
    this.getStudygroups();
  }

  async getStudygroups(){
    console.log("Getting studygroups...");
    let email = this.state.currentUser;

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: {user: email}
    };
    await API.post(apiName, path, myInit)
      .then((response) => {
        console.log("Response bdodsdhsdy:", response);
        response.body.map((item) => {
          this.setState({
            study_groups:[
              ...this.state.study_groups,
              {
                groupId: item.groupId,
                course: item.course,
                group_name: item.group_name,
                members: item.members,
                professor: item.professor
              }
            ]
          })
        })
        // console.log('Success: ', this.state.study_groups);
      })
      .catch((error) => {
        console.log("Something went wrong: ", error);
      });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  handleOk = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  handleCancel = (e) => {
    console.log(e);
    this.setState({
      visible: false,
    });
  }

  render() {
    return (
      <div className="studygroup-container">
        <div className="item-studygroup">
          <Title level={3}>My Study Groups</Title>
          <List
            grid={{ gutter: 16, column: 4 }}
            dataSource={this.state.study_groups}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  title={item.group_name}
                  style={{ width: 300 }}
                  
                >
                <Meta
                  description={item.members}
                />  
                </Card>
              </List.Item>
            )}
          />
          
          <Button type="primary" onClick={this.getStudygroups}>Get Studygroups</Button>
          <Button type="primary" onClick={this.showModal}>Create a Group</Button>
          <Modal
            title="Create a Group"
            style={{top: 30}}
            visible={this.state.visible}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
          >
            <CreateStudyGroupForm/>
          </Modal>
        </div>
      </div>
    )
  }
}

export default Studygroup
