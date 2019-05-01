import React, { Component } from 'react'
import {
  Typography,
  List,
  Skeleton, Card, Modal
} from 'antd';
import { API } from "aws-amplify";

const { Meta } = Card;
const { Text } = Typography;

export class ProfileStudyGroups extends Component {
  constructor(props){
    super(props);

    this.state ={
      cardsLoading: true,
    };

    this.openCard = this.openCard.bind(this);
  }

  async componentDidMount(){
    this.getStudygroups();
  }

  async getStudygroups(){
    this.setState({
      study_groups: [],
      cardsLoading: true
    });

    let user = this.props.user;
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

  openCard = (item) => {
    this.setState({
      currentCard: item,
      cardModalVisible: true
    });
    console.log(`Opening group card '${item.group_name}'`);

  };

  handleCardModalCancel = () => {
    this.setState({
      cardModalVisible: false,
    });
  };

  // returnMembers(){
  //   let members = this.state.currentCard.members;
  //   members.forEach((member) => {
  //
  //   })
  // }

  render() {
    let cardsLoading = this.state.cardsLoading;

    const blankData = [];
    for (let i = 0; i < 5; i++) {
      blankData.push({
        title: `Blank title`,
        description: 'Blank description',
        content: 'Blank content',
      });
    }

    return (
      <div>
        <List
          grid={{ column: 1 }}
          dataSource={cardsLoading ? blankData : this.state.study_groups}
          renderItem={item => (
            <List.Item>
              <Card
                hoverable
                style={{ width: "100%", marginTop: 16 }}
                loading={cardsLoading}>
                <Meta
                  onClick={() => this.openCard(item)}
                  title={item.group_name}
                  description={item.description}
                />
              </Card>
            </List.Item>
          )}
        />

        <Modal
          title={this.state.currentCard === undefined ? "Loading..." : this.state.currentCard.group_name}
          style={{top: 30}}
          visible={this.state.cardModalVisible}
          onCancel={this.handleCardModalCancel}
          footer={null}
            >
          {this.state.currentCard === undefined ?
            <Skeleton />
            :
            <div>
              <Text><Text style={{fontWeight: "bold"}}>Description: </Text>{this.state.currentCard.description}</Text><br/>
              <Text><Text style={{fontWeight: "bold"}}>Course: </Text>{this.state.currentCard.course}</Text><br/>
              <Text><Text style={{fontWeight: "bold"}}>Professor: </Text>{this.state.currentCard.professor}</Text><br/>
              <Text style={{fontWeight: "bold"}}>Members: </Text>{this.state.currentCard.members.map((member, key) => {
              return (<div key={key}><Text>{member}</Text></div>)
            })}
            </div>
            }
        </Modal>
      </div>
    )
  }
}

export default ProfileStudyGroups
