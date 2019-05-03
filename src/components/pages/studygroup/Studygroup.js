import React, { Component } from 'react';
import {Typography, Button, Modal, Skeleton, Divider, Avatar} from 'antd';
// import uuid from "uuid";
import { API, Auth} from "aws-amplify";
import CreateStudyGroupForm from './createStudyGroup';
import "./Studygroup.css";
import MyStudyGroups from "../profile/ProfileStudyGroups";
import Comments from "../feeds/Comments";

// const { Meta } = Card;

const { Title, Text, Paragraph } = Typography;
export class Studygroup extends Component {
  constructor(props){
    super(props);

    this.state = {
      cardsLoading: true,
      currentCard: undefined,
      currentStudygroup: undefined,
      study_groups:[],
      cardModalVisible: false,
      str: "This is a test"
    };

    this.getStudygroups = this.getStudygroups.bind(this);
    this.switchStudygroup = this.switchStudygroup.bind(this);
    this.updateGroups = this.updateGroups.bind(this);
  }

  async componentDidMount(){
    this.props.handler("Study Groups");
    await Auth.currentAuthenticatedUser({
      bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email, username: user.attributes.preferred_username})
    }).catch(err => console.log(err));
    this.getStudygroups();
  }

  async getStudygroups(){
    this.setState({
      study_groups: [],
      cardsLoading: true
    });

    let user = this.state.user;
    console.log("Getting studygroups for user "+user);

    let apiName = 'posts';
    let path = '/studygroups/get-studygroups';
    let myInit = {
      body: {user}
    };

    await API.post(apiName, path, myInit).then(response => {
      console.log('Successfylly got studygroups: ', response.body);
      this.setState({currentStudygroup: response.body[0]});
      response.body.map((item) => (
        this.setState({
          study_groups:[
            ...this.state.study_groups,
            {
              groupId: item.groupId,
              course: item.course,
              group_name: item.group_name,
              description: item.description,
              members: item.members,
              professor: item.professor,
              timestamp: item.timestamp,
              created_by: item.created_by
            }
          ]
        })
      ));
      this.setState({cardsLoading: false});
    }).catch(e => {
      console.log("Encountered an error in getting studygroups: ", e);
    });
  }

  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  handleCardModalCancel = () => {
    this.setState({
      cardModalVisible: false,
    });
  };

  switchStudygroup(group){
    console.log("Setting current studygroup to: ", group.group_name);
    this.setState({currentStudygroup: group})
  }

  onChange = (str) => {
    console.log('Content change:', str);
    this.setState({ str });
  };

  updateGroups(studygroup){
    console.log("Adding new group to users' studygroups list: ", studygroup);
    this.setState(prevState => ({
      study_groups: [
        {
          groupId: studygroup.groupId,
          course: studygroup.course,
          group_name: studygroup.group_name,
          description: studygroup.description,
          members: studygroup.members,
          professor: studygroup.professor,
          timestamp: studygroup.timestamp,
          created_by: studygroup.created_by
        },
        ...prevState.study_groups
      ]
    }))
  }

  render() {
    let cardsLoading = this.state.cardsLoading;
    let currentStudygroup = this.state.currentStudygroup ? this.state.currentStudygroup : {group_name: "Loading...", description: "Loading...", created_by: "", };
    let id = this.state.currentStudygroup ? this.state.currentStudygroup.groupId : "1234";

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        group_name: "",
        description: "",
      });
    }

    return (
      <div className="studygroup-container">
        <div className="item-studygroup">
          <Title level={3}>My Study Groups</Title>
          <Button type="primary" onClick={this.showModal}>Create a Group</Button>
          {this.state.user ? <MyStudyGroups user={this.state.user} switch={this.switchStudygroup} study_groups={cardsLoading ? blankData : this.state.study_groups} /> : <Skeleton /> }
        </div>
        <div className="studygroup-divider" >
          <Divider type="vertical" style={{height: '100%', left: 20}}/>
        </div>
        <div className="item-studygroup-content">
          <Title level={2}>{currentStudygroup.group_name}</Title>
          <Text>Created by: {currentStudygroup.created_by}</Text><br/>
          <Text>Members</Text>
          {this.state.currentStudygroup ? currentStudygroup.members.map((item, index) => (
            <div><Text>{item}</Text><br/></div>
          )) : "\nLoading..."}
          <Title level={3}>Description</Title>
          <Paragraph>{currentStudygroup.description}</Paragraph>
          <Divider><Text style={{fontSize: 22}}>Messaging Board</Text></Divider>
          <Comments id={id} user={this.state.username}/>
        </div>


        <Modal
          title="Create a Study Group"
          style={{top: 30}}
          visible={this.state.visible}
          onCancel={this.handleCancel}
          footer={null}
        >
          <CreateStudyGroupForm closeModal={this.handleCancel} switch={this.switchStudygroup} user={this.state.user} updateGroups={this.updateGroups}/>
        </Modal>

        <Modal
          title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.group_name}
          style={{top: 30}}
          visible={this.state.cardModalVisible}
          onCancel={this.handleCardModalCancel}
          footer={null}
        >
        </Modal>
      </div>
    )
  }
}

export default Studygroup
