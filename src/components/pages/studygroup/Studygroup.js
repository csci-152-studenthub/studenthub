import React, { Component } from 'react';
import { Typography, Button, Modal, Skeleton } from 'antd';
// import uuid from "uuid";
import { API, Auth} from "aws-amplify";
import CreateStudyGroupForm from './createStudyGroup';
import "./Studygroup.css";
import MyStudyGroups from "../profile/ProfileStudyGroups";

// const { Meta } = Card;

const { Title } = Typography;
export class Studygroup extends Component {
  constructor(props){
    super(props);

    this.state = {
      cardsLoading: true,
      currentCard: undefined,
      study_groups:[],
      cardModalVisible: false
    };

    this.getStudygroups = this.getStudygroups.bind(this);
  }

  async componentDidMount(){
    this.props.handler("Study Groups");
    await Auth.currentAuthenticatedUser({
      bypassCache: true  // Optional, By default is false. If set to true, this call will send a request to Cognito to get the latest user data
    }).then(user => {
      this.setState({user: user.attributes.email})
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
    const groups = await API.post(apiName, path, myInit);
    console.log('Got groups: ',groups);
    groups.body.map((item) => (
      this.setState({
        study_groups:[
          ...this.state.study_groups,
          {
            groupId: item.groupId,
            course: item.course,
            group_name: item.group_name,
            description: item.description,
            members: item.members,
            professor: item.professor
          }
        ]
      })
    ));
    this.setState({cardsLoading: false});
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

  render() {
    // let cardsLoading = this.state.cardsLoading;

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        group_name: `Blank title`,
        description: 'Blank description',
      });
    }

    return (
      <div className="studygroup-container">
        <div className="item-studygroup">
          <Title level={3}>My Study Groups</Title>
          {this.state.user ? <MyStudyGroups user={this.state.user}/> : <Skeleton /> }
          <Button type="primary" onClick={this.showModal}>Create a Group</Button>

          <Modal
            title="Create a Study Group"
            style={{top: 30}}
            visible={this.state.visible}
            onCancel={this.handleCancel}
            footer={null}
          >
            <CreateStudyGroupForm closeModal={this.handleCancel} getStudygroups={this.getStudygroups}/>
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
      </div>
    )
  }
}

export default Studygroup
