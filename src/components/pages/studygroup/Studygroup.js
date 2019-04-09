import React, { Component } from 'react';
import { message, Typography, Button, Modal, Card, List } from 'antd';
import uuid from "uuid";
import { API, Auth} from "aws-amplify";
import CreateStudyGroupForm from './createStudyGroup';
import "./Studygroup.css";


const { Title } = Typography;
export class Studygroup extends Component {
  constructor(props){
    super(props);

    this.state = {
      my_studygroup:[{
        currentUser: 'hardcoded',
        studygroup_name: 'whole loatta',
        studygroup_description: 'gang doo doo',
      }]
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
    let email = this.state.currentUser;

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: email
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
            dataSource={this.state.my_studygroup}
            renderItem={item => (
              <List.Item>
                <Card
                  hoverable
                  title={item.studygroup_name}
                  style={{ width: 300 }}
                >
                  <p>{item.studygroup_description}</p>
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
